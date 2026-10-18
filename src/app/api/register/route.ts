import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validations";
// import { sendRegistrationEmail } from "@/lib/email";

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

    // Temporarily disabled automated emails as requested
    // await sendRegistrationEmail(participant.email, participant.fullName);

    return NextResponse.json({ success: true, data: participant }, { status: 201 });
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
