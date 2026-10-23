import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get("audience") || "ALL";
    const search = searchParams.get("search") || "";

    const where: any = {};

    // Audience filter
    if (audience === "NEW" || audience === "UNSENT") {
      where.OR = [
        { emailStatus: "PENDING" },
        { emailStatus: "FAILED" },
      ];
    } else if (audience === "CONFIRMED") {
      where.status = "CONFIRMED";
    } else if (audience === "STUDENTS") {
      where.category = {
        contains: "student",
        mode: "insensitive",
      };
    } else if (audience === "FACULTY_INDUSTRY") {
      where.OR = [
        { category: { contains: "faculty", mode: "insensitive" } },
        { category: { contains: "industry", mode: "insensitive" } },
        { category: { contains: "professional", mode: "insensitive" } },
      ];
    }

    // Search filter
    if (search.trim()) {
      const s = search.trim();
      const searchCondition = {
        OR: [
          { fullName: { contains: s, mode: "insensitive" } },
          { email: { contains: s, mode: "insensitive" } },
          { institutionOrCompany: { contains: s, mode: "insensitive" } },
        ],
      };

      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          searchCondition,
        ];
        delete where.OR;
      } else {
        where.OR = searchCondition.OR;
      }
    }

    const [total, recipients] = await Promise.all([
      prisma.participant.count({ where }),
      prisma.participant.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          category: true,
          institutionOrCompany: true,
          status: true,
          emailStatus: true,
          registrationDate: true,
        },
        orderBy: { registrationDate: "desc" },
      }),
    ]);

    // Also get counts by segment for the badges
    const [allCount, unsentCount, confirmedCount] = await Promise.all([
      prisma.participant.count(),
      prisma.participant.count({
        where: {
          OR: [
            { emailStatus: "PENDING" },
            { emailStatus: "FAILED" },
          ],
        },
      }),
      prisma.participant.count({ where: { status: "CONFIRMED" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: recipients,
      total,
      counts: {
        all: allCount,
        unsent: unsentCount,
        confirmed: confirmedCount,
      },
    });
  } catch (error: any) {
    console.error("Fetch email recipients error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipients list", details: error.message },
      { status: 500 }
    );
  }
}
