"use client";

import React from "react";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  Award,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { Participant } from "./CandidateModal";
import { AdminTab } from "./AdminSidebar";

interface OverviewViewProps {
  stats: any;
  participants: Participant[];
  onSelectCandidate: (candidate: Participant) => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export function OverviewView({
  stats,
  participants,
  onSelectCandidate,
  onNavigateTab,
}: OverviewViewProps) {
  if (!stats) {
    return (
      <div className="py-20 text-center text-slate-500 animate-pulse">
        <Activity className="w-8 h-8 mx-auto mb-2 text-sky-500 animate-spin" />
        <p className="text-sm">Calculating real-time database statistics...</p>
      </div>
    );
  }

  const {
    totalCount = 0,
    ieeeMemberCount = 0,
    nonIeeeCount = 0,
    ieeePercentage = 0,
    todayCount = 0,
    categoryCounts = {},
    experienceCounts = {},
    emailStatusCounts = { sent: 0, pending: 0, failed: 0 },
    timeline = [],
    recentAuditLogs = [],
  } = stats;

  const studentCount = Object.entries(categoryCounts)
    .filter(([k]) => k.toLowerCase().includes("student"))
    .reduce((acc, [, v]) => acc + (v as number), 0);

  const proCount = totalCount - studentCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp size={12} />
              +{todayCount} today
            </span>
            <span>• Neon PostgreSQL</span>
          </div>
        </div>

        {/* IEEE Members */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">IEEE Members</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {ieeeMemberCount}{" "}
            <span className="text-sm font-normal text-slate-400">({ieeePercentage}%)</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Non-Members: <span className="font-semibold text-slate-300">{nonIeeeCount}</span>
          </div>
        </div>

        {/* Students */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Students</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-400">{studentCount}</div>
          <div className="mt-2 text-xs text-slate-400">
            Pro & Faculty: <span className="font-semibold text-slate-300">{proCount}</span>
          </div>
        </div>

        {/* Email Confirmations */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emails Sent</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Mail size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-teal-400">{emailStatusCounts.sent}</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-amber-400">{emailStatusCounts.pending} Pending</span>
            <span>•</span>
            <span className="text-red-400">{emailStatusCounts.failed} Failed</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Registration Timeline */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-sky-400" />
                <span>Registration Trend Timeline</span>
              </h3>
              <p className="text-xs text-slate-400">Daily participant acquisition trajectory</p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
              {timeline.length} Recorded Day(s)
            </span>
          </div>

          {timeline.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No date records available</div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-end gap-3 h-44 pb-2 border-b border-slate-800 px-2">
                {timeline.map((item: any, idx: number) => {
                  const maxVal = Math.max(...timeline.map((t: any) => t.count), 1);
                  const heightPercent = Math.max(15, Math.round((item.count / maxVal) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <span className="text-[10px] font-mono text-sky-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-sky-600 to-teal-400 rounded-t-lg transition-all group-hover:from-sky-500 group-hover:to-teal-300 shadow-md shadow-sky-600/20"
                      />
                      <span className="text-[10px] text-slate-400 truncate max-w-full font-mono">
                        {item.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Start: {timeline[0]?.date}</span>
                <span>Latest: {timeline[timeline.length - 1]?.date}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chart 2: IEEE Status & Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>IEEE Member Ratio</span>
              </h3>
              <span className="text-xs text-emerald-400 font-bold">{ieeePercentage}%</span>
            </div>

            {/* Visual Ring / Ratio Bar */}
            <div className="space-y-4 pt-2">
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${ieeePercentage}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                  title={`IEEE Members: ${ieeeMemberCount}`}
                />
                <div
                  style={{ width: `${100 - ieeePercentage}%` }}
                  className="bg-slate-700 h-full transition-all duration-500"
                  title={`Non-Members: ${nonIeeeCount}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">IEEE Members</div>
                  <div className="text-xl font-black text-white">{ieeeMemberCount}</div>
                  <div className="text-[11px] text-slate-400">{ieeePercentage}% of pool</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Non-Members</div>
                  <div className="text-xl font-black text-white">{nonIeeeCount}</div>
                  <div className="text-[11px] text-slate-400">{100 - ieeePercentage}% of pool</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            IEEE members receive prioritized tape-out hardware review by IEEE Sensors Council reviewers.
          </div>
        </div>
      </div>

      {/* Experience & Category Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase size={16} className="text-teal-400" />
              <span>Participant Category Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{Object.keys(categoryCounts).length} Types</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]: [string, any], idx) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[280px]">{cat}</span>
                    <span className="text-slate-400 font-mono">
                      {count} <span className="text-slate-500">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-teal-500 h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Level Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              <span>Experience Level Profile</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">RF & EDA Familiarity</span>
          </div>

          <div className="space-y-3">
            {Object.entries(experienceCounts).map(([exp, count]: [string, any], idx) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[280px]">{exp}</span>
                    <span className="text-slate-400 font-mono">
                      {count} <span className="text-slate-500">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Registrations & Live Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-sky-400" />
                <span>Recent Candidates</span>
              </h3>
              <p className="text-xs text-slate-400">Newly registered applicants in PostgreSQL</p>
            </div>
            <button
              onClick={() => onNavigateTab("registrations")}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              View All ({totalCount}) →
            </button>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {participants.slice(0, 5).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectCandidate(p)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-bold text-white hover:text-sky-400 transition-colors">{p.fullName}</div>
                  <div className="text-[11px] text-slate-400">{p.institutionOrCompany}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    {format(new Date(p.registrationDate), "MMM d, HH:mm")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      p.ieeeMember
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {p.ieeeMember ? "IEEE" : "Guest"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Admin Audit Log Activity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-indigo-400" />
              <span>Admin Activity</span>
            </h3>
            <button
              onClick={() => onNavigateTab("settings")}
              className="text-xs text-slate-400 hover:text-white"
            >
              Full Log →
            </button>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No admin operations logged yet</div>
          ) : (
            <div className="space-y-3 text-xs">
              {recentAuditLogs.map((log: any) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold font-mono text-sky-400 uppercase">{log.action}</span>
                    <span className="text-slate-500 font-mono">
                      {format(new Date(log.createdAt), "MM/dd HH:mm")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
