import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendRegistrationEmail,
  sendBulkEmails,
  sendCustomBroadcastEmail,
  sendBulkCustomBroadcastEmails,
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      mode,
      templateType = "CONFIRMATION", // "CONFIRMATION" | "CUSTOM_BROADCAST"
      testEmail,
      participantId,
      participantIds,
      recipients: passedRecipients,
      audience,
      email,
      fullName,
      subject,
      headline,
      badgeText,
      bodyContent,
      ctaText,
      ctaUrl,
      additionalNote,
      customMessage,
    } = body;

    // 1. TEST MODE: Send a single sample test email directly to admin / specified email
    if (mode === "test" && testEmail) {
      const sampleName = fullName || "Admin Test Recipient";
      const sampleCategory = "Faculty / Lead Organizer";
      const sampleInstitution = "Ramaiah Institute of Technology (MSRIT)";
      const testSubject = `[TEST] ${subject || "Masterclass Update Preview"}`;

      let result;
      if (templateType === "CUSTOM_BROADCAST") {
        result = await sendCustomBroadcastEmail({
          email: testEmail.trim(),
          fullName: sampleName,
          category: sampleCategory,
          institution: sampleInstitution,
          subject: testSubject,
          headline: headline || "Important Masterclass Update & Guidelines",
          badgeText: badgeText || "TEST PREVIEW",
          bodyContent: bodyContent || "This is a test preview of your custom masterclass announcement.",
          ctaText,
          ctaUrl,
          additionalNote,
        });
      } else {
        result = await sendRegistrationEmail({
          email: testEmail.trim(),
          fullName: sampleName,
          category: sampleCategory,
          institution: sampleInstitution,
          subject: testSubject,
          customMessage: customMessage || bodyContent,
          type: "ANNOUNCEMENT",
        });
      }

      await prisma.adminAuditLog.create({
        data: {
          action: "SEND_TEST_EMAIL",
          adminUser: "admin",
          details: `Sent test preview email to ${testEmail} (${templateType}). Outcome: ${result.success ? "SUCCESS" : "FAILED"}`,
        },
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to deliver test email", details: result },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Test email dispatched to ${testEmail}`,
        resendId: result.resendId,
      });
    }

    // 2. Resolve Recipients List:
    let candidatesToProcess: Array<{
      id?: string;
      email: string;
      fullName: string;
      category?: string;
      institutionOrCompany?: string;
    }> = [];

    // Case A: Explicit recipients array passed directly from client (for chunked batching)
    if (Array.isArray(passedRecipients) && passedRecipients.length > 0) {
      candidatesToProcess = passedRecipients;
    }
    // Case B: By audience segment
    else if (audience) {
      const where: any = {};
      if (audience === "NEW" || audience === "UNSENT") {
        where.OR = [
          { emailStatus: "PENDING" },
          { emailStatus: "FAILED" },
          { emailStatus: null },
        ];
      } else if (audience === "CONFIRMED") {
        where.status = "CONFIRMED";
      }

      const dbCandidates = await prisma.participant.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          category: true,
          institutionOrCompany: true,
        },
      });
      candidatesToProcess = dbCandidates;
    }
    // Case C: By participantIds array
    else if (Array.isArray(participantIds) && participantIds.length > 0) {
      candidatesToProcess = await prisma.participant.findMany({
        where: { id: { in: participantIds } },
        select: {
          id: true,
          email: true,
          fullName: true,
          category: true,
          institutionOrCompany: true,
        },
      });
    }
    // Case D: Single participant
    else if (participantId || (email && fullName)) {
      if (participantId) {
        const single = await prisma.participant.findUnique({
          where: { id: participantId },
          select: {
            id: true,
            email: true,
            fullName: true,
            category: true,
            institutionOrCompany: true,
          },
        });
        if (single) candidatesToProcess = [single];
      } else if (email && fullName) {
        candidatesToProcess = [{
          email,
          fullName,
          category: "Candidate",
          institutionOrCompany: "Academic / Research Institution",
        }];
      }
    }

    if (candidatesToProcess.length === 0) {
      return NextResponse.json(
        { error: "No matching recipients found to dispatch emails to." },
        { status: 404 }
      );
    }

    // 3. Dispatch: Check whether it is a Custom Broadcast or standard Confirmation
    if (templateType === "CUSTOM_BROADCAST") {
      const broadcastPayload = {
        subject: subject || "Important Masterclass Update: IEEE RF IC Design Series",
        headline: headline || "Important Masterclass Update & Guidelines",
        badgeText: badgeText || "OFFICIAL UPDATE",
        bodyContent: bodyContent || "We are pleased to share key logistical and technical updates regarding the IEEE RF IC Design Masterclass.",
        ctaText,
        ctaUrl,
        additionalNote,
      };

      const bulkResult = await sendBulkCustomBroadcastEmails(candidatesToProcess, broadcastPayload);

      await prisma.adminAuditLog.create({
        data: {
          action: candidatesToProcess.length > 1 ? "BULK_CUSTOM_EMAIL" : "SEND_CUSTOM_EMAIL",
          adminUser: "admin",
          details: `Custom broadcast dispatched to ${candidatesToProcess.length} recipients. Sent: ${bulkResult.sent}, Failed: ${bulkResult.failed}`,
        },
      });

      return NextResponse.json({
        success: true,
        summary: bulkResult,
        abortedReason: bulkResult.abortedReason,
        message: bulkResult.abortedReason
          ? `Dispatch stopped early: ${bulkResult.abortedReason} (${bulkResult.sent} sent, ${bulkResult.failed} failed)`
          : `Processed ${bulkResult.total} emails (${bulkResult.sent} sent, ${bulkResult.failed} failed)`,
      });
    }

    // Default: Standard Confirmation Email
    const confSubject = subject || "Registration Confirmed: IEEE RF IC Design Masterclass";
    const bulkResult = await sendBulkEmails(
      candidatesToProcess.map((c) => ({
        id: c.id || "",
        email: c.email,
        fullName: c.fullName,
        category: c.category,
        institutionOrCompany: c.institutionOrCompany,
      })),
      confSubject,
      customMessage || bodyContent
    );

    await prisma.adminAuditLog.create({
      data: {
        action: candidatesToProcess.length > 1 ? "BULK_EMAIL" : "SEND_INDIVIDUAL_EMAIL",
        adminUser: "admin",
        details: `Confirmation emails processed for ${candidatesToProcess.length} candidates. Sent: ${bulkResult.sent}, Failed: ${bulkResult.failed}`,
      },
    });

    return NextResponse.json({
      success: true,
      summary: bulkResult,
      abortedReason: bulkResult.abortedReason,
      message: bulkResult.abortedReason
        ? `Dispatch stopped early: ${bulkResult.abortedReason} (${bulkResult.sent} sent, ${bulkResult.failed} failed)`
        : `Processed ${bulkResult.total} emails (${bulkResult.sent} sent, ${bulkResult.failed} failed)`,
    });
  } catch (error: any) {
    console.error("Admin email dispatch route error:", error);
    return NextResponse.json(
      { error: "Internal server error dispatching email", details: error.message },
      { status: 500 }
    );
  }
}
