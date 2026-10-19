"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  RefreshCw,
  Download,
  Server,
  User,
  ArrowLeft,
  ChevronRight,
  Shield,
  Loader2,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onMobileMenuOpen: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportCsv: () => void;
}

const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: "Executive Overview",
    subtitle: "Real-time registration statistics and performance KPIs",
  },
  registrations: {
    title: "Candidate Ledger",
    subtitle: "Search, filter, manage, and verify candidate applications",
  },
  email: {
    title: "Email Dispatch Center",
    subtitle: "Send confirmation emails, broadcasts, and inspect provider delivery logs",
  },
  analytics: {
    title: "Demographics & Readiness",
    subtitle: "Detailed demographic distributions and tape-out eligibility",
  },
  settings: {
    title: "Audit Trail & Infrastructure",
    subtitle: "System security status, Resend webhooks, and administrative activity log",
  },
};

export function AdminHeader({
  activeTab,
  onMobileMenuOpen,
  onRefresh,
  isRefreshing,
  onExportCsv,
}: AdminHeaderProps) {
  const current = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="h-20 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span>Admin Portal</span>
            <ChevronRight size={11} className="text-slate-600" />
            <span className="text-sky-400 font-semibold capitalize">{activeTab}</span>
          </div>

          <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right: Controls & Admin Info */}
      <div className="flex items-center gap-3">
        {/* Database Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-slate-300 text-[11px]">PostgreSQL Connected</span>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh real-time data"
        >
          <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
        </button>

        {/* Quick CSV Export */}
        <button
          type="button"
          onClick={onExportCsv}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 transition-all hover:scale-105 active:scale-95"
          title="Export CSV"
        >
          <Download size={13} />
          <span>Export CSV</span>
        </button>

        {/* Admin Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs">
            <User size={15} />
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">Administrator</span>
            <span className="text-[10px] text-slate-500">IEEE Console</span>
          </div>
        </div>
      </div>
    </header>
  );
}
