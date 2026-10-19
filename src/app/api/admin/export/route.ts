import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const experienceLevel = searchParams.get("experienceLevel");
    const ieeeMemberParam = searchParams.get("ieeeMember");
    const emailStatus = searchParams.get("emailStatus");

    const where: any = {};
    if (category && category !== "ALL") where.category = category;
    if (experienceLevel && experienceLevel !== "ALL") where.experienceLevel = experienceLevel;
    if (ieeeMemberParam === "true") where.ieeeMember = true;
    else if (ieeeMemberParam === "false") where.ieeeMember = false;
    if (emailStatus && emailStatus !== "ALL") where.emailStatus = emailStatus;

    const participants = await prisma.participant.findMany({
      where,
      orderBy: { registrationDate: "desc" },
    });

    // CSV header row
    const headers = [
      "Participant ID",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Institution / Organization",
      "Category",
      "Experience Level",
      "IEEE Member",
      "IEEE Membership ID",
      "LinkedIn URL",
      "GitHub Handle",
      "Registration Date (UTC)",
      "Email Status",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(",")];

    for (const p of participants) {
      const row = [
        escapeCsv(p.id),
        escapeCsv(p.fullName),
        escapeCsv(p.email),
        escapeCsv(p.phone || ""),
        escapeCsv(p.institutionOrCompany),
        escapeCsv(p.category),
        escapeCsv(p.experienceLevel),
        escapeCsv(p.ieeeMember ? "YES" : "NO"),
        escapeCsv(p.ieeeMembershipId || ""),
        escapeCsv(p.linkedinUrl || ""),
        escapeCsv(p.githubHandle || ""),
        escapeCsv(p.registrationDate ? p.registrationDate.toISOString() : ""),
        escapeCsv(p.emailStatus || "PENDING"),
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\r\n");
    const filename = `rfic_registrations_${format(new Date(), "yyyy-MM-dd_HHmm")}.csv`;

    await prisma.adminAuditLog.create({
      data: {
        action: "EXPORT_CSV",
        adminUser: "admin",
        details: `Exported ${participants.length} participant records to CSV (${filename})`,
      },
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Export CSV error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV export", details: error.message },
      { status: 500 }
    );
  }
}
