import * as React from "react";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { RegistrationConfirmationEmail } from "@/emails/RegistrationConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "mock_key");

export interface SendEmailOptions {
  participantId?: string;
  email: string;
  fullName: string;
  category?: string;
  institution?: string;
  subject?: string;
  customMessage?: string;
  type?: "CONFIRMATION" | "ANNOUNCEMENT" | "CUSTOM";
}

/**
 * Creates a nodemailer SMTP transporter if SMTP configuration is present
 */
export function getSmtpTransporter() {
  const user = process.env.SMTP_USER || "rfic.ieeescritb@gmail.com";
  const pass = process.env.SMTP_PASS || "nhwhvhnnuvfwnwwz";
  if (!user || !pass) return null;

  // Clean pass: if user pasted an App Password with spaces (e.g. "abcd efgh ijkl mnop"), strip spaces
  const cleanPass = pass.replace(/\s+/g, "");

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
  });
}

export async function verifySmtpConnection(): Promise<{
  success: boolean;
  message: string;
  configured: boolean;
  user?: string;
  requiresAppPassword?: boolean;
}> {
  const user = process.env.SMTP_USER || "rfic.ieeescritb@gmail.com";
  const pass = process.env.SMTP_PASS || "nhwhvhnnuvfwnwwz";
  if (!user || !pass) {
    return {
      success: false,
      configured: false,
      message: "SMTP is not configured. Missing SMTP_USER or SMTP_PASS in environment variables.",
    };
  }

  const transporter = getSmtpTransporter();
  if (!transporter) {
    return {
      success: false,
      configured: false,
      message: "SMTP transporter could not be initialized.",
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      configured: true,
      user: user.trim(),
      message: `SMTP connection successfully verified for ${user.trim()}! Ready to dispatch automated emails.`,
    };
  } catch (err: any) {
    const rawMsg = err.message || "Unknown error";
    const isAppPassRequired =
      rawMsg.includes("534-5.7.9") ||
      rawMsg.includes("Application-specific password required") ||
      rawMsg.includes("InvalidSecondFactor") ||
      rawMsg.includes("535-5.7.8") ||
      rawMsg.includes("BadCredentials");

    if (isAppPassRequired) {
      return {
        success: false,
        configured: true,
        user: user.trim(),
        requiresAppPassword: true,
        message:
          "Google 2-Step Verification is active on " +
          user.trim() +
          ". Google requires a 16-character App Password (https://myaccount.google.com/apppasswords) instead of the standard account password. Set SMTP_PASS in .env.",
      };
    }

    return {
      success: false,
      configured: true,
      user: user.trim(),
      message: rawMsg,
    };
  }
}

export async function sendRegistrationEmail({
  participantId,
  email,
  fullName,
  category = "Candidate",
  institution = "Academic / Research Institution",
  subject = "Registration Confirmed: IEEE RF IC Design Masterclass",
  customMessage,
  type = "CONFIRMATION",
}: SendEmailOptions): Promise<{ success: boolean; resendId?: string; error?: string }> {
  try {
    // 1. Render both branded HTML and Plain Text versions for optimal deliverability (avoids MIME_HTML_ONLY spam penalty)
    const emailElement = React.createElement(RegistrationConfirmationEmail, {
      fullName,
      category,
      institution,
      customMessage,
    });

    const [htmlContent, textContent] = await Promise.all([
      render(emailElement),
      render(emailElement, { plainText: true }),
    ]);

    const smtpTransporter = getSmtpTransporter();

    // 2. Path A: Dispatch via SMTP (rfic.ieeescritb@gmail.com) if configured
    if (smtpTransporter) {
      const activeUser = process.env.SMTP_USER || "rfic.ieeescritb@gmail.com";
      const fromAddress =
        process.env.EMAIL_FROM ||
        `"IEEE Sensors Council RIT-B" <${activeUser}>`;

      try {
        const providerId = `smtp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const info = await smtpTransporter.sendMail({
          from: fromAddress,
          to: email,
          replyTo: `"IEEE Sensors Council RIT-B" <${activeUser}>`,
          subject,
          text: textContent,
          html: htmlContent,
          headers: {
            "X-Entity-Ref-ID": providerId,
            "X-Mailer": "IEEE Sensors Council Portal",
            "X-Auto-Response-Suppress": "OOF, AutoReply",
          },
        });

        const finalId = info.messageId || providerId;

        await prisma.emailLog.create({
          data: {
            participantId: participantId || null,
            recipientEmail: email,
            recipientName: fullName,
            subject,
            type,
            status: "SENT",
            resendId: finalId,
            metadata: JSON.stringify({ provider: "smtp", from: fromAddress, envelope: info.envelope }),
          },
        });

        if (participantId) {
          await prisma.participant.update({
            where: { id: participantId },
            data: {
              emailStatus: "SENT",
              emailSentAt: new Date(),
            },
          });
        }

        return { success: true, resendId: finalId };
      } catch (smtpErr: any) {
        let errMessage = smtpErr.message || "SMTP dispatch error";
        if (
          errMessage.includes("BadCredentials") ||
          errMessage.includes("535-5.7.8") ||
          errMessage.includes("534-5.7.9") ||
          errMessage.includes("Application-specific password required") ||
          errMessage.includes("InvalidSecondFactor")
        ) {
          errMessage =
            "Google SMTP authentication failed: Since 2-Step Verification is active on " +
            (process.env.SMTP_USER || "this account") +
            ", Google requires a 16-character App Password (generate at https://myaccount.google.com/apppasswords) rather than the standard account password. Set SMTP_PASS in .env to the generated 16-character App Password.";
        }

        console.error(`SMTP delivery failed for ${email}:`, errMessage);

        await prisma.emailLog.create({
          data: {
            participantId: participantId || null,
            recipientEmail: email,
            recipientName: fullName,
            subject,
            type,
            status: "FAILED",
            error: errMessage,
          },
        });

        if (participantId) {
          await prisma.participant.update({
            where: { id: participantId },
            data: { emailStatus: "FAILED" },
          });
        }

        return { success: false, error: errMessage };
      }
    }

    // 3. Path B: Dispatch via Resend API
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "mock_key") {
      const senderFrom = process.env.EMAIL_FROM || "IEEE Sensors Council RIT-B <onboarding@resend.dev>";
      const { data, error } = await resend.emails.send({
        from: senderFrom,
        to: [email],
        subject,
        text: textContent,
        html: htmlContent,
      });

      if (error) {
        let errMessage = error.message || JSON.stringify(error);
        if (
          errMessage.includes("testing emails to your own email address") ||
          errMessage.includes("verify a domain")
        ) {
          errMessage =
            "Hosting environment missing SMTP configuration. Resend fallback blocked dispatch because domain is unverified. Automated Gmail SMTP (rfic.ieeescritb@gmail.com) is recommended.";
        }
        console.error(`Resend API error for ${email}:`, errMessage);

        await prisma.emailLog.create({
          data: {
            participantId: participantId || null,
            recipientEmail: email,
            recipientName: fullName,
            subject,
            type,
            status: "FAILED",
            error: errMessage,
          },
        });

        if (participantId) {
          await prisma.participant.update({
            where: { id: participantId },
            data: { emailStatus: "FAILED" },
          });
        }

        return { success: false, error: error.message };
      }

      const resendId = data?.id || `resend_${Date.now()}`;

      await prisma.emailLog.create({
        data: {
          participantId: participantId || null,
          recipientEmail: email,
          recipientName: fullName,
          subject,
          type,
          status: "SENT",
          resendId,
        },
      });

      if (participantId) {
        await prisma.participant.update({
          where: { id: participantId },
          data: {
            emailStatus: "SENT",
            emailSentAt: new Date(),
          },
        });
      }

      return { success: true, resendId };
    }

    // 4. Path C: Simulation / Mock Fallback if no provider is configured
    console.log(`[MOCK EMAIL DISPATCH] To: ${email} | Subject: ${subject}`);
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    await prisma.emailLog.create({
      data: {
        participantId: participantId || null,
        recipientEmail: email,
        recipientName: fullName,
        subject,
        type,
        status: "SENT",
        resendId: mockId,
        metadata: JSON.stringify({ mode: "mock", simulated: true }),
      },
    });

    if (participantId) {
      await prisma.participant.update({
        where: { id: participantId },
        data: {
          emailStatus: "SENT",
          emailSentAt: new Date(),
        },
      });
    }

    return { success: true, resendId: mockId };
  } catch (err: any) {
    console.error(`Unexpected email dispatch error for ${email}:`, err);

    try {
      await prisma.emailLog.create({
        data: {
          participantId: participantId || null,
          recipientEmail: email,
          recipientName: fullName,
          subject,
          type,
          status: "FAILED",
          error: err.message || "Unknown email delivery failure",
        },
      });

      if (participantId) {
        await prisma.participant.update({
          where: { id: participantId },
          data: { emailStatus: "FAILED" },
        });
      }
    } catch (logErr) {
      console.warn("Failed to log error state in database:", logErr);
    }

    return { success: false, error: err.message || "Email dispatch failed" };
  }
}

export async function sendBulkEmails(
  candidates: Array<{
    id: string;
    email: string;
    fullName: string;
    category?: string;
    institutionOrCompany?: string;
  }>,
  subject: string,
  customMessage?: string
): Promise<{ total: number; sent: number; failed: number; errors: Array<{ email: string; error: string }> }> {
  let sent = 0;
  let failed = 0;
  const errors: Array<{ email: string; error: string }> = [];

  for (const c of candidates) {
    const result = await sendRegistrationEmail({
      participantId: c.id,
      email: c.email,
      fullName: c.fullName,
      category: c.category,
      institution: c.institutionOrCompany,
      subject,
      customMessage,
      type: "ANNOUNCEMENT",
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
      errors.push({ email: c.email, error: result.error || "Failed" });
    }

    // Small delay between sends to respect rate limits (e.g. 250ms)
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return { total: candidates.length, sent, failed, errors };
}
