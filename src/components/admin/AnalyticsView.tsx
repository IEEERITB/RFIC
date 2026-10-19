"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  Cpu,
  Sparkles,
  PieChart,
} from "lucide-react";

interface AnalyticsViewProps {
  stats: any;
}

export function AnalyticsView({ stats }: AnalyticsViewProps) {
  if (!stats) return null;

  const {
    totalCount = 0,
    ieeeMemberCount = 0,
    nonIeeeCount = 0,
    ieeePercentage = 0,
    categoryCounts = {},
    experienceCounts = {},
    emailStatusCounts = { sent: 0, pending: 0, failed: 0 },
    timeline = [],
  } = stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Live Registry Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive Participant Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-time multi-dimensional demographic, academic, and technical readiness indicators calculated from verified PostgreSQL participant rows.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Enrolled</div>
            <div className="text-2xl font-black text-white">{totalCount}</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-emerald-400 font-bold">IEEE Ratio</div>
            <div className="text-2xl font-black text-emerald-400">{ieeePercentage}%</div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold">
              <Briefcase size={16} className="text-sky-400" />
              <span>Participant Category Distribution</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">100% Normalized</span>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([cat, count]: [string, any], idx) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[280px]">{cat}</span>
                    <span className="font-mono text-slate-200 font-bold">
                      {count} <span className="text-slate-500 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-gradient-to-r from-sky-600 to-teal-400 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Breakdown Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold">
              <Award size={16} className="text-amber-400" />
              <span>RF IC Technical Preparedness</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Competence Levels</span>
          </div>

          <div className="space-y-4">
            {Object.entries(experienceCounts).map(([exp, count]: [string, any], idx) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[280px]">{exp}</span>
                    <span className="font-mono text-slate-200 font-bold">
                      {count} <span className="text-slate-500 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-gradient-to-r from-amber-600 to-orange-400 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversion & Verification Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Dual-Tier Distinction</span>
          </div>
          <div className="text-2xl font-black text-white">{ieeeMemberCount}</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Registered IEEE members qualifying for verified institutional physical silicon tape-out review.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Cpu size={14} className="text-teal-400" />
            <span>FOSS EDA Toolchain</span>
          </div>
          <div className="text-2xl font-black text-white">100%</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All registered candidates receive full access instructions for Xschem, Ngspice, and openEMS.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-sky-400" />
            <span>Tape-Out Shuttle Readiness</span>
          </div>
          <div className="text-2xl font-black text-white">IHP / Sky130</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            130nm Foundry PDK target models integrated into the 8-module curriculum schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
