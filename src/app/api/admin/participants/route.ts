import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "";
    const experienceLevel = searchParams.get("experienceLevel") || "";
    const ieeeMemberParam = searchParams.get("ieeeMember");
    const emailStatus = searchParams.get("emailStatus") || "";
    const sortBy = searchParams.get("sortBy") || "registrationDate";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(5, Math.min(200, parseInt(searchParams.get("pageSize") || "25", 10)));

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { institutionOrCompany: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { ieeeMembershipId: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (experienceLevel && experienceLevel !== "ALL") {
      where.experienceLevel = experienceLevel;
    }

    if (ieeeMemberParam === "true") {
      where.ieeeMember = true;
    } else if (ieeeMemberParam === "false") {
      where.ieeeMember = false;
    }

    if (emailStatus && emailStatus !== "ALL") {
      where.emailStatus = emailStatus;
    }

    // Sorting definition
    const allowedSortFields = ["registrationDate", "fullName", "email", "institutionOrCompany", "category", "ieeeMember"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "registrationDate";

    const [total, participants] = await Promise.all([
      prisma.participant.count({ where }),
      prisma.participant.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          emailLogs: {
            take: 3,
            orderBy: { sentAt: "desc" },
            select: { id: true, subject: true, status: true, sentAt: true, error: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: participants,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Participants query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants ledger", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, category, experienceLevel } = body;

    if (!id) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
    }

    const updated = await prisma.participant.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(experienceLevel ? { experienceLevel } : {}),
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        action: "UPDATE_PARTICIPANT",
        adminUser: "admin",
        details: `Updated participant ${updated.email} (${updated.fullName}) with status: ${updated.status}`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update participant error:", error);
    return NextResponse.json(
      { error: "Failed to update participant record", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
    }

    const existing = await prisma.participant.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    await prisma.participant.delete({
      where: { id },
    });

    await prisma.adminAuditLog.create({
      data: {
        action: "DELETE_PARTICIPANT",
        adminUser: "admin",
        details: `Deleted candidate record: ${existing.fullName} (${existing.email})`,
      },
    });

    return NextResponse.json({ success: true, message: "Participant record removed successfully" });
  } catch (error: any) {
    console.error("Delete participant error:", error);
    return NextResponse.json(
      { error: "Failed to delete participant record", details: error.message },
      { status: 500 }
    );
  }
}
