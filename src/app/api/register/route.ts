import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validations";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validatedData = registrationSchema.parse(body);

    const existingUser = await prisma.participant.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered for this series." },
        { status: 409 }
      );
    }

    const { joinedWhatsapp, ...dbData } = validatedData as any;

    const participant = await prisma.participant.create({
      data: dbData,
    });

    // Send confirmation email asynchronously (isolated from database persistence)
    let emailSent = false;
    try {
      const emailResult = await sendRegistrationEmail({
        participantId: participant.id,
        email: participant.email,
        fullName: participant.fullName,
        category: participant.category,
        institution: participant.institutionOrCompany,
      });
      emailSent = emailResult.success;
    } catch (emailErr) {
      console.warn("Automated email dispatch encountered an error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: participant,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
