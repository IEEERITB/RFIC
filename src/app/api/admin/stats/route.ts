import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { registrationDate: "asc" },
      select: {
        id: true,
        category: true,
        experienceLevel: true,
        ieeeMember: true,
        emailStatus: true,
        registrationDate: true,
      },
    });

    const totalCount = participants.length;
    const ieeeMemberCount = participants.filter((p) => p.ieeeMember).length;
    const nonIeeeCount = totalCount - ieeeMemberCount;
    const ieeePercentage = totalCount > 0 ? Math.round((ieeeMemberCount / totalCount) * 100) : 0;

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    for (const p of participants) {
      const cat = p.category || "Unspecified";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    // Experience breakdown
    const experienceCounts: Record<string, number> = {};
    for (const p of participants) {
      const exp = p.experienceLevel || "Unspecified";
      experienceCounts[exp] = (experienceCounts[exp] || 0) + 1;
    }

    // Email delivery metrics
    const emailStatusCounts = {
      sent: participants.filter((p) => p.emailStatus === "SENT" || p.emailStatus === "DELIVERED").length,
      pending: participants.filter((p) => p.emailStatus === "PENDING" || !p.emailStatus).length,
      failed: participants.filter((p) => p.emailStatus === "FAILED" || p.emailStatus === "BOUNCED").length,
    };

    // Registrations over time (Timeline by Date)
    const timelineMap: Record<string, number> = {};
    const todayStr = new Date().toISOString().split("T")[0];
    let todayCount = 0;

    for (const p of participants) {
      const dateStr = new Date(p.registrationDate).toISOString().split("T")[0];
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
      if (dateStr === todayStr) {
        todayCount++;
      }
    }

    const timeline = Object.entries(timelineMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Recent audit logs
    const recentAuditLogs = await prisma.adminAuditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalCount,
        ieeeMemberCount,
        nonIeeeCount,
        ieeePercentage,
        todayCount,
        categoryCounts,
        experienceCounts,
        emailStatusCounts,
        timeline,
        recentAuditLogs,
      },
    });
  } catch (error: any) {
    console.error("Admin stats query error:", error);
    return NextResponse.json(
      { error: "Failed to aggregate dashboard statistics", details: error.message },
      { status: 500 }
    );
  }
}
