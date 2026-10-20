import { NextResponse } from "next/server";
import { verifySmtpConnection } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await verifySmtpConnection();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to test SMTP connection",
      },
      { status: 500 }
    );
  }
}
