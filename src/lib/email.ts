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
function getSmtpTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user,
      pass,
    },
  });
}

export async function sendRegistrationEmail({
  participantId,
  email,
  fullName,
  category = "Candidate",
  institution = "Academic / Research Institution",
  subject = "Registration Confirmed - IEEE RF IC Design Masterclass 5G/6G",
  customMessage,
  type = "CONFIRMATION",
}: SendEmailOptions): Promise<{ success: boolean; resendId?: string; error?: string }> {
  try {
    // 1. Render the branded React Email template to an HTML string
    const htmlContent = await render(
      React.createElement(RegistrationConfirmationEmail, {
        fullName,
        category,
        institution,
        customMessage,
      })
    );

    const smtpTransporter = getSmtpTransporter();

    // 2. Path A: Dispatch via Institutional SMTP (ieeesc@msrit.edu) if configured
    if (smtpTransporter) {
      const fromAddress =
        process.env.EMAIL_FROM ||
        `"IEEE Sensors Council RIT" <${process.env.SMTP_USER}>`;

      try {
        const info = await smtpTransporter.sendMail({
          from: fromAddress,
          to: email,
          subject,
          html: htmlContent,
        });

        const providerId = info.messageId || `smtp_${Date.now()}`;

        await prisma.emailLog.create({
          data: {
            participantId: participantId || null,
            recipientEmail: email,
            recipientName: fullName,
            subject,
            type,
            status: "SENT",
            resendId: providerId,
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

        return { success: true, resendId: providerId };
      } catch (smtpErr: any) {
        let errMessage = smtpErr.message || "SMTP dispatch error";
        if (errMessage.includes("BadCredentials") || errMessage.includes("535-5.7.8")) {
          errMessage =
            "Google Workspace SMTP authentication failed: Google requires a 16-character App Password (https://myaccount.google.com/apppasswords) rather than the standard account password.";
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
      const senderFrom = process.env.EMAIL_FROM || "IEEE RF IC Series <onboarding@resend.dev>";
      const { data, error } = await resend.emails.send({
        from: senderFrom,
        to: [email],
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error(`Resend API error for ${email}:`, error);

        await prisma.emailLog.create({
          data: {
            participantId: participantId || null,
            recipientEmail: email,
            recipientName: fullName,
            subject,
            type,
            status: "FAILED",
            error: error.message || JSON.stringify(error),
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
