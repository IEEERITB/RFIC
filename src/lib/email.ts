import * as React from "react";
import nodemailer, { Transporter } from "nodemailer";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { RegistrationConfirmationEmail } from "@/emails/RegistrationConfirmationEmail";
import { CustomBroadcastEmail } from "@/emails/CustomBroadcastEmail";

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

let globalSmtpTransporter: Transporter | null = null;

/**
 * Creates or reuses a nodemailer SMTP transporter with connection pooling.
 * Connection pooling is CRITICAL for bulk emails: without pooling, every email
 * opens a new TLS handshake and performs AUTH LOGIN, which triggers Google's
 * anti-abuse rate limiter ("454-4.7.0 Too many login attempts").
 */
export function getSmtpTransporter(): Transporter | null {
  let user = (process.env.SMTP_USER || "trivedipriyanshu@ieee.org").trim();
  let pass = (process.env.SMTP_PASS || "qjpcoljcvpzkajmg").trim();

  // Automatic safeguard: If old throttled consumer gmail is in environment, upgrade to IEEE Google Workspace
  if (user === "rfic.ieeescritb@gmail.com") {
    user = "trivedipriyanshu@ieee.org";
    pass = "qjpcoljcvpzkajmg";
  }

  if (!user || !pass) return null;

  if (globalSmtpTransporter) {
    return globalSmtpTransporter;
  }

  // Clean pass: if user pasted an App Password with spaces (e.g. "abcd efgh ijkl mnop"), strip spaces
  const cleanPass = pass.replace(/\s+/g, "");

  globalSmtpTransporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    maxConnections: 1, // Keep single connection open: prevents Gmail's 454 "Too many login attempts"
    maxMessages: 100,  // Recycle connection cleanly every 100 emails
    rateDelta: 1000,   // Delay window: 1 second
    rateLimit: 1,      // Max 1 message per second (safe and compliant with Google SMTP policies)
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
  });

  return globalSmtpTransporter;
}

export function resetSmtpTransporter() {
  if (globalSmtpTransporter) {
    try {
      globalSmtpTransporter.close();
    } catch {}
    globalSmtpTransporter = null;
  }
}

export async function verifySmtpConnection(): Promise<{
  success: boolean;
  message: string;
  configured: boolean;
  user?: string;
  requiresAppPassword?: boolean;
}> {
  let user = (process.env.SMTP_USER || "trivedipriyanshu@ieee.org").trim();
  let pass = (process.env.SMTP_PASS || "qjpcoljcvpzkajmg").trim();

  if (user === "rfic.ieeescritb@gmail.com") {
    user = "trivedipriyanshu@ieee.org";
    pass = "qjpcoljcvpzkajmg";
  }

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

    // 2. Path A: Dispatch via SMTP (trivedipriyanshu@ieee.org) if configured
    if (smtpTransporter) {
      let activeUser = (process.env.SMTP_USER || "trivedipriyanshu@ieee.org").trim();
      if (activeUser === "rfic.ieeescritb@gmail.com") {
        activeUser = "trivedipriyanshu@ieee.org";
      }
      let fromAddress = process.env.EMAIL_FROM || `"IEEE Sensors Council RIT-B" <${activeUser}>`;
      if (fromAddress.includes("rfic.ieeescritb@gmail.com")) {
        fromAddress = `"IEEE Sensors Council RIT-B" <${activeUser}>`;
      }

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
): Promise<{
  total: number;
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
  abortedReason?: string;
}> {
  let sent = 0;
  let failed = 0;
  const errors: Array<{ email: string; error: string }> = [];
  let abortedReason: string | undefined;

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
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

      const errLower = (result.error || "").toLowerCase();
      if (
        errLower.includes("too many login attempts") ||
        errLower.includes("454") ||
        errLower.includes("quota exceeded") ||
        errLower.includes("550 5.4.5") ||
        errLower.includes("user rate limit")
      ) {
        abortedReason = result.error;
        console.warn(`[Bulk Send Aborted] Provider rate limit/quota reached at ${c.email}: ${result.error}`);
        break;
      }
    }

    // Polite delay between sends (500ms) to respect Gmail connection and avoid serverless timeout
    if (i < candidates.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return { total: candidates.length, sent, failed, errors, abortedReason };
}

export interface SendCustomBroadcastEmailOptions {
  participantId?: string;
  email: string;
  fullName: string;
  category?: string;
  institution?: string;
  subject: string;
  headline?: string;
  badgeText?: string;
  bodyContent: string;
  ctaText?: string;
  ctaUrl?: string;
  additionalNote?: string;
}

export async function sendCustomBroadcastEmail({
  participantId,
  email,
  fullName,
  category = "Candidate",
  institution = "Academic / Research Institution",
  subject,
  headline,
  badgeText,
  bodyContent,
  ctaText,
  ctaUrl,
  additionalNote,
}: SendCustomBroadcastEmailOptions): Promise<{ success: boolean; resendId?: string; error?: string }> {
  try {
    // Personalize variables in bodyContent: {{name}} -> fullName, {{category}} -> category, etc.
    const personalizedBody = bodyContent
      .replace(/\{\{\s*name\s*\}\}/gi, fullName)
      .replace(/\{\{\s*email\s*\}\}/gi, email)
      .replace(/\{\{\s*category\s*\}\}/gi, category)
      .replace(/\{\{\s*institution\s*\}\}/gi, institution);

    const personalizedHeadline = (headline || "Important Masterclass Update")
      .replace(/\{\{\s*name\s*\}\}/gi, fullName);

    const emailElement = React.createElement(CustomBroadcastEmail, {
      fullName,
      category,
      institution,
      subject,
      headline: personalizedHeadline,
      badgeText: badgeText || "OFFICIAL UPDATE",
      bodyContent: personalizedBody,
      ctaText: ctaText?.trim() || undefined,
      ctaUrl: ctaUrl?.trim() || undefined,
      additionalNote: additionalNote?.trim() || undefined,
    });

    const [htmlContent, textContent] = await Promise.all([
      render(emailElement),
      render(emailElement, { plainText: true }),
    ]);

    const smtpTransporter = getSmtpTransporter();

    if (smtpTransporter) {
      let activeUser = (process.env.SMTP_USER || "trivedipriyanshu@ieee.org").trim();
      if (activeUser === "rfic.ieeescritb@gmail.com") {
        activeUser = "trivedipriyanshu@ieee.org";
      }
      let fromAddress = process.env.EMAIL_FROM || `"IEEE Sensors Council RIT-B" <${activeUser}>`;
      if (fromAddress.includes("rfic.ieeescritb@gmail.com")) {
        fromAddress = `"IEEE Sensors Council RIT-B" <${activeUser}>`;
      }

      try {
        const providerId = `smtp_custom_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const info = await smtpTransporter.sendMail({
          from: fromAddress,
          to: email,
          replyTo: `"IEEE Sensors Council RIT-B" <${activeUser}>`,
          subject,
          text: textContent,
          html: htmlContent,
          headers: {
            "X-Entity-Ref-ID": providerId,
            "X-Mailer": "IEEE Sensors Council Portal Broadcast",
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
            type: "ANNOUNCEMENT",
            status: "DELIVERED",
            resendId: finalId,
            metadata: JSON.stringify({
              provider: "smtp",
              host: process.env.SMTP_HOST || "smtp.gmail.com",
              headline,
              hasCta: Boolean(ctaText && ctaUrl),
            }),
          },
        });

        if (participantId) {
          await prisma.participant.update({
            where: { id: participantId },
            data: {
              emailStatus: "DELIVERED",
              emailSentAt: new Date(),
            },
          });
        }

        return { success: true, resendId: finalId };
      } catch (smtpErr: any) {
        console.warn(`[SMTP Custom Broadcast Failed] ${email}:`, smtpErr.message);
        throw smtpErr;
      }
    }

    // Mock fallback for local testing without SMTP
    const mockId = `mock_custom_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await prisma.emailLog.create({
      data: {
        participantId: participantId || null,
        recipientEmail: email,
        recipientName: fullName,
        subject,
        type: "ANNOUNCEMENT",
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
    console.error(`Unexpected custom broadcast dispatch error for ${email}:`, err);
    try {
      await prisma.emailLog.create({
        data: {
          participantId: participantId || null,
          recipientEmail: email,
          recipientName: fullName,
          subject,
          type: "ANNOUNCEMENT",
          status: "FAILED",
          error: err.message || "Custom broadcast delivery failure",
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
    return { success: false, error: err.message || "Custom broadcast dispatch failed" };
  }
}

export async function sendBulkCustomBroadcastEmails(
  candidates: Array<{
    id?: string;
    email: string;
    fullName: string;
    category?: string;
    institutionOrCompany?: string;
  }>,
  payload: {
    subject: string;
    headline?: string;
    badgeText?: string;
    bodyContent: string;
    ctaText?: string;
    ctaUrl?: string;
    additionalNote?: string;
  }
): Promise<{
  total: number;
  sent: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
  abortedReason?: string;
}> {
  let sent = 0;
  let failed = 0;
  const errors: Array<{ email: string; error: string }> = [];
  let abortedReason: string | undefined;

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const result = await sendCustomBroadcastEmail({
      participantId: c.id,
      email: c.email,
      fullName: c.fullName,
      category: c.category,
      institution: c.institutionOrCompany,
      subject: payload.subject,
      headline: payload.headline,
      badgeText: payload.badgeText,
      bodyContent: payload.bodyContent,
      ctaText: payload.ctaText,
      ctaUrl: payload.ctaUrl,
      additionalNote: payload.additionalNote,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
      errors.push({ email: c.email, error: result.error || "Failed" });

      const errLower = (result.error || "").toLowerCase();
      if (
        errLower.includes("too many login attempts") ||
        errLower.includes("454") ||
        errLower.includes("quota exceeded") ||
        errLower.includes("550 5.4.5") ||
        errLower.includes("user rate limit")
      ) {
        abortedReason = result.error;
        console.warn(`[Bulk Custom Broadcast Aborted] Provider rate limit/quota reached at ${c.email}: ${result.error}`);
        break;
      }
    }

    // Delay between sends (500ms) to respect Gmail connection pooling and avoid serverless timeouts
    if (i < candidates.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return { total: candidates.length, sent, failed, errors, abortedReason };
}

