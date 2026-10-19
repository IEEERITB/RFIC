"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Trash2,
  Mail,
  Send,
  Eye,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Participant } from "./CandidateModal";

interface RegistrationsViewProps {
  participants: Participant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  category: string;
  experienceLevel: string;
  ieeeMember: string;
  emailStatus: string;
  isLoading: boolean;
  onSearchChange: (val: string) => void;
  onFilterChange: (filters: {
    category?: string;
    experienceLevel?: string;
    ieeeMember?: string;
    emailStatus?: string;
    page?: number;
    pageSize?: number;
  }) => void;
  onRefresh: () => void;
  onExportCsv: () => void;
  onSelectCandidate: (candidate: Participant) => void;
  onOpenSendEmail: (candidates: Participant[]) => void;
  onDeleteCandidate: (id: string, name: string) => void;
}

export function RegistrationsView({
  participants,
  total,
  page,
  pageSize,
  totalPages,
  search,
  category,
  experienceLevel,
  ieeeMember,
  emailStatus,
  isLoading,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onExportCsv,
  onSelectCandidate,
  onOpenSendEmail,
  onDeleteCandidate,
}: RegistrationsViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(participants.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    onSearchChange("");
    onFilterChange({
      category: "ALL",
      experienceLevel: "ALL",
      ieeeMember: "ALL",
      emailStatus: "ALL",
      page: 1,
    });
    setSelectedIds([]);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await onExportCsv();
    setIsExporting(false);
  };

  const selectedCandidates = participants.filter((p) => selectedIds.includes(p.id));
  const hasActiveFilters =
    search ||
    (category && category !== "ALL") ||
    (experienceLevel && experienceLevel !== "ALL") ||
    (ieeeMember && ieeeMember !== "ALL") ||
    (emailStatus && emailStatus !== "ALL");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, institution, phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh ledger"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 transition-all hover:scale-105 active:scale-95"
            >
              {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-semibold mr-1">
            <Filter size={13} />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Student (Ramaiah / MSRIT)">Ramaiah Students</option>
            <option value="Student (External College / University)">External Students</option>
            <option value="Research Scholar / PhD Candidate">PhD / Scholars</option>
            <option value="Industry / Working Professional">Industry Professionals</option>
            <option value="Faculty / Academia">Faculty</option>
          </select>

          {/* Experience Filter */}
          <select
            value={experienceLevel}
            onChange={(e) => onFilterChange({ experienceLevel: e.target.value, page: 1 })}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Experience Levels</option>
            <option value="Beginner (No prior tape-out)">Beginner</option>
            <option value="Intermediate (Basic Analog/VLSI)">Intermediate</option>
            <option value="Advanced (RF IC / Past Tape-outs)">Advanced</option>
          </select>

          {/* IEEE Member Filter */}
          <select
            value={ieeeMember}
            onChange={(e) => onFilterChange({ ieeeMember: e.target.value, page: 1 })}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Memberships</option>
            <option value="true">IEEE Members Only</option>
            <option value="false">Non-Members</option>
          </select>

          {/* Email Status Filter */}
          <select
            value={emailStatus}
            onChange={(e) => onFilterChange({ emailStatus: e.target.value, page: 1 })}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Email States</option>
            <option value="SENT">Sent</option>
            <option value="DELIVERED">Delivered</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-sky-400 hover:text-sky-300 underline font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-sky-950/80 border border-sky-800/80 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
              {selectedIds.length}
            </span>
            <span className="font-semibold">Candidate(s) Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenSendEmail(selectedCandidates)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold transition-all"
            >
              <Send size={12} />
              <span>Send Bulk Email ({selectedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === participants.length && participants.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 accent-sky-600 rounded bg-slate-800 border-slate-700 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5">Candidate Details</th>
                <th className="px-4 py-3.5">Institution & Category</th>
                <th className="px-4 py-3.5">Experience</th>
                <th className="px-4 py-3.5">IEEE Status</th>
                <th className="px-4 py-3.5">Email Delivery</th>
                <th className="px-4 py-3.5">Registered</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-sky-500" />
                    <span>Querying PostgreSQL database...</span>
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <p className="text-sm font-medium">No candidates match current query criteria.</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-2 text-xs text-sky-400 hover:underline"
                    >
                      Clear all search & filter filters
                    </button>
                  </td>
                </tr>
              ) : (
                participants.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? "bg-sky-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(p.id)}
                          className="w-4 h-4 accent-sky-600 rounded bg-slate-800 border-slate-700 cursor-pointer"
                        />
                      </td>

                      {/* Candidate */}
                      <td className="px-4 py-3.5">
                        <div
                          onClick={() => onSelectCandidate(p)}
                          className="font-bold text-white hover:text-sky-400 transition-colors cursor-pointer text-sm"
                        >
                          {p.fullName}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                          <span>{p.email}</span>
                          {p.phone && <span className="font-mono text-[11px] text-slate-500">• {p.phone}</span>}
                        </div>
                      </td>

                      {/* Institution & Category */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="text-slate-200 font-medium truncate" title={p.institutionOrCompany}>
                          {p.institutionOrCompany}
                        </div>
                        <span className="inline-block text-[10px] text-slate-400 font-medium mt-0.5 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 truncate max-w-full">
                          {p.category}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.experienceLevel?.includes("Beginner")
                              ? "bg-sky-950 text-sky-400 border-sky-800"
                              : p.experienceLevel?.includes("Intermediate")
                              ? "bg-teal-950 text-teal-400 border-teal-800"
                              : "bg-purple-950 text-purple-400 border-purple-800"
                          }`}
                        >
                          {p.experienceLevel}
                        </span>
                      </td>

                      {/* IEEE Status */}
                      <td className="px-4 py-3.5">
                        {p.ieeeMember ? (
                          <div className="text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck size={13} />
                            <span>Member {p.ieeeMembershipId ? `(#${p.ieeeMembershipId})` : ""}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">Guest / Non-Member</span>
                        )}
                      </td>

                      {/* Email Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.emailStatus === "SENT" || p.emailStatus === "DELIVERED"
                              ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                              : p.emailStatus === "FAILED"
                              ? "bg-red-950 text-red-400 border-red-800"
                              : "bg-amber-950 text-amber-400 border-amber-800"
                          }`}
                        >
                          {p.emailStatus === "SENT" || p.emailStatus === "DELIVERED" ? (
                            <CheckCircle2 size={11} />
                          ) : p.emailStatus === "FAILED" ? (
                            <AlertCircle size={11} />
                          ) : (
                            <Clock size={11} />
                          )}
                          <span>{p.emailStatus || "PENDING"}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                        {format(new Date(p.registrationDate), "MMM d, yyyy")}
                      </td>

                      {/* Row Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectCandidate(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Full Dossier"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenSendEmail([p])}
                            className="p-1.5 rounded-lg bg-sky-950/70 hover:bg-sky-900 border border-sky-800 text-sky-400 transition-colors"
                            title="Send / Resend Email"
                          >
                            <Send size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCandidate(p.id, p.fullName)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900 text-red-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-slate-900">
          <div className="flex items-center gap-2">
            <span>Showing {participants.length} of {total} registered candidates</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onFilterChange({ pageSize: parseInt(e.target.value, 10), page: 1 })}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-white"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onFilterChange({ page: Math.max(1, page - 1) })}
                disabled={page <= 1 || isLoading}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                aria-label="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ page: Math.min(totalPages, page + 1) })}
                disabled={page >= totalPages || isLoading}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                aria-label="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
