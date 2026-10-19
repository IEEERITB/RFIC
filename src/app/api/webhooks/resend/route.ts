import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const type = payload?.type;
    const data = payload?.data;
    const emailId = data?.email_id;

    if (!type || !emailId) {
      return NextResponse.json({ message: "Ignored, missing event details" }, { status: 200 });
    }

    let mappedStatus: string | null = null;
    let deliveredAt: Date | null = null;

    if (type === "email.delivered") {
      mappedStatus = "DELIVERED";
      deliveredAt = new Date();
    } else if (type === "email.bounced") {
      mappedStatus = "BOUNCED";
    } else if (type === "email.sent") {
      mappedStatus = "SENT";
    } else if (type === "email.complained") {
      mappedStatus = "BOUNCED";
    }

    if (mappedStatus) {
      // Find matching email log
      const emailLog = await prisma.emailLog.findFirst({
        where: { resendId: emailId },
      });

      if (emailLog) {
        await prisma.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: mappedStatus,
            ...(deliveredAt ? { deliveredAt } : {}),
            metadata: JSON.stringify(data),
          },
        });

        if (emailLog.participantId) {
          await prisma.participant.update({
            where: { id: emailLog.participantId },
            data: {
              emailStatus: mappedStatus,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Resend webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failure" }, { status: 500 });
  }
}
