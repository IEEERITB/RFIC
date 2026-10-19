import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRegistrationEmail, sendBulkEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { participantId, participantIds, subject, customMessage } = body;

    // Single participant dispatch
    if (participantId) {
      const candidate = await prisma.participant.findUnique({
        where: { id: participantId },
      });

      if (!candidate) {
        return NextResponse.json({ error: "Participant not found" }, { status: 404 });
      }

      const result = await sendRegistrationEmail({
        participantId: candidate.id,
        email: candidate.email,
        fullName: candidate.fullName,
        category: candidate.category,
        institution: candidate.institutionOrCompany,
        subject: subject || "Registration Confirmed - IEEE RF IC Design Masterclass 5G/6G",
        customMessage,
        type: "CONFIRMATION",
      });

      await prisma.adminAuditLog.create({
        data: {
          action: "SEND_INDIVIDUAL_EMAIL",
          adminUser: "admin",
          details: `Dispatched confirmation email to ${candidate.email} (${candidate.fullName}). Outcome: ${result.success ? "SUCCESS" : "FAILED"}`,
        },
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Email delivery failed", details: result },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Confirmation email dispatched to ${candidate.email}`,
        resendId: result.resendId,
      });
    }

    // Bulk participant dispatch
    if (Array.isArray(participantIds) && participantIds.length > 0) {
      const candidates = await prisma.participant.findMany({
        where: { id: { in: participantIds } },
      });

      if (candidates.length === 0) {
        return NextResponse.json({ error: "No matching participants found" }, { status: 404 });
      }

      const bulkResult = await sendBulkEmails(
        candidates,
        subject || "Important Update - IEEE RF IC Design Masterclass 5G/6G",
        customMessage
      );

      await prisma.adminAuditLog.create({
        data: {
          action: "BULK_EMAIL",
          adminUser: "admin",
          details: `Sent bulk emails to ${candidates.length} candidates. Sent: ${bulkResult.sent}, Failed: ${bulkResult.failed}`,
        },
      });

      return NextResponse.json({
        success: true,
        summary: bulkResult,
        message: `Processed ${bulkResult.total} emails (${bulkResult.sent} sent, ${bulkResult.failed} failed)`,
      });
    }

    return NextResponse.json(
      { error: "Provide either a participantId or participantIds array" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin email dispatch error:", error);
    return NextResponse.json(
      { error: "Internal server error dispatching email", details: error.message },
      { status: 500 }
    );
  }
}
