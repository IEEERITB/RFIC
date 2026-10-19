/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Mail,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";

export type AdminTab = "overview" | "registrations" | "email" | "analytics" | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  totalParticipants?: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  totalParticipants = 0,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "registrations" as AdminTab,
      label: "Registrations",
      icon: Users,
      badge: totalParticipants > 0 ? String(totalParticipants) : null,
    },
    {
      id: "email" as AdminTab,
      label: "Email Center",
      icon: Mail,
      badge: null,
    },
    {
      id: "analytics" as AdminTab,
      label: "Analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "settings" as AdminTab,
      label: "Audit & Settings",
      icon: Settings,
      badge: null,
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="/logos/ieee-opensilicon.png"
                alt="IEEE openSilicon"
                className="h-8 w-auto object-contain bg-white/95 p-1 rounded-lg shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-white text-sm tracking-tight truncate">
                  RF IC Admin
                </span>
                <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase">
                  Production Console
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <img
                src="/logos/ieee-opensilicon.png"
                alt="IEEE"
                className="h-7 w-auto object-contain bg-white/95 p-1 rounded-lg"
              />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Portal Return */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              collapsed ? "justify-center px-0" : ""
            }`}
            title="Return to Public Website"
          >
            <ArrowLeft size={16} className="shrink-0 text-sky-400" />
            {!collapsed && <span>Live Public Portal</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
