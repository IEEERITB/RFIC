import { Resend } from "resend";
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
  // If no RESEND_API_KEY or key is dummy, record as mock sent
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "mock_key") {
    console.log(`[MOCK EMAIL DISPATCH] To: ${email} | Subject: ${subject}`);
    const mockResendId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    try {
      await prisma.emailLog.create({
        data: {
          participantId: participantId || null,
          recipientEmail: email,
          recipientName: fullName,
          subject,
          type,
          status: "SENT",
          resendId: mockResendId,
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
    } catch (dbErr) {
      console.warn("Could not log mock email dispatch:", dbErr);
    }

    return { success: true, resendId: mockResendId };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "IEEE RF IC Series <onboarding@resend.dev>",
      to: [email],
      subject,
      react: RegistrationConfirmationEmail({
        fullName,
        category,
        institution,
        customMessage,
      }),
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
          data: {
            emailStatus: "FAILED",
          },
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
          data: {
            emailStatus: "FAILED",
          },
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

    // Small delay between sends to respect rate limits (e.g. 150ms)
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return { total: candidates.length, sent, failed, errors };
}
