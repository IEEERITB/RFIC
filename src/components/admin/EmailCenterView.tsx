"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { format } from "date-fns";
import { Participant } from "./CandidateModal";

interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName?: string | null;
  subject: string;
  type: string;
  status: string;
  resendId?: string | null;
  error?: string | null;
  sentAt: string | Date;
  deliveredAt?: string | Date | null;
  participant?: {
    id: string;
    fullName: string;
    email: string;
    category?: string;
  } | null;
}

interface EmailCenterViewProps {
  participants: Participant[];
  onOpenSendEmail: (candidates: Participant[]) => void;
}

export function EmailCenterView({ participants, onOpenSendEmail }: EmailCenterViewProps) {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/email/logs?page=${page}&pageSize=${pageSize}&status=${statusFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setLogs(data.data || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch email logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRetry = async (log: EmailLog) => {
    setRetryingId(log.id);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: log.participant?.id,
          subject: log.subject,
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setRetryingId(null);
    }
  };

  const pendingEmailCandidates = participants.filter(
    (p) => !p.emailStatus || p.emailStatus === "PENDING" || p.emailStatus === "FAILED"
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Campaign Launcher Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 border border-sky-800/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950 border border-sky-800 px-3 py-1 rounded-full inline-block">
              Email Dispatch Operations
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Masterclass Communication Center
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Send branded registration confirmations, weekend lecture links, and official MPW tape-out notifications directly to registered candidates via the Resend API.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => onOpenSendEmail(participants)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Send size={13} />
              <span>Broadcast to All Candidates ({participants.length})</span>
            </button>

            {pendingEmailCandidates.length > 0 && (
              <button
                type="button"
                onClick={() => onOpenSendEmail(pendingEmailCandidates)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition-all"
              >
                <Clock size={13} />
                <span>Send to Unsent / Pending ({pendingEmailCandidates.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Resend Webhook / Environment Status Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resend Integration</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Sender Identity:</span>
                <span className="text-slate-200 font-mono text-[11px]">onboarding@resend.dev</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Template Engine:</span>
                <span className="text-teal-400 font-semibold">React Email Components</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Webhook:</span>
                <span className="text-sky-400 font-mono text-[11px]">/api/webhooks/resend</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-500 leading-snug">
              Webhooks automatically capture delivery confirmations and bounces in PostgreSQL.
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Logs Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Email Dispatch & Delivery Audit Log ({total})
            </h3>
            <p className="text-xs text-slate-400">Historical provider transaction ledger</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Delivery Statuses</option>
              <option value="SENT">Sent</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
              <option value="BOUNCED">Bounced</option>
            </select>

            <button
              type="button"
              onClick={fetchLogs}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh logs"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Recipient</th>
                <th className="px-5 py-3.5">Subject & Campaign</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Resend Message ID</th>
                <th className="px-5 py-3.5">Dispatched</th>
                <th className="px-5 py-3.5 text-right">Retry / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-sky-500" />
                    <span>Loading delivery records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No email logs found matching filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Recipient */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white">{log.recipientName || "Candidate"}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.recipientEmail}</div>
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-3.5 max-w-[260px]">
                      <div className="text-slate-200 font-medium truncate" title={log.subject}>
                        {log.subject}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60 inline-block mt-0.5">
                        {log.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.status === "DELIVERED" || log.status === "SENT"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : log.status === "FAILED" || log.status === "BOUNCED"
                            ? "bg-red-950 text-red-400 border-red-800"
                            : "bg-amber-950 text-amber-400 border-amber-800"
                        }`}
                      >
                        {log.status === "DELIVERED" || log.status === "SENT" ? (
                          <CheckCircle2 size={11} />
                        ) : (
                          <AlertCircle size={11} />
                        )}
                        <span>{log.status}</span>
                      </span>
                      {log.error && (
                        <span className="block text-[10px] text-red-400 mt-1 max-w-xs truncate" title={log.error}>
                          {log.error}
                        </span>
                      )}
                    </td>

                    {/* Resend ID */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                      {log.resendId ? log.resendId.slice(0, 18) + "..." : "—"}
                    </td>

                    {/* Dispatched Date */}
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                      {format(new Date(log.sentAt), "MMM d, HH:mm")}
                    </td>

                    {/* Retry Action */}
                    <td className="px-5 py-3.5 text-right">
                      {log.status === "FAILED" ? (
                        <button
                          type="button"
                          onClick={() => handleRetry(log)}
                          disabled={retryingId === log.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-[11px] font-semibold"
                        >
                          {retryingId === log.id ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <RefreshCw size={11} />
                          )}
                          <span>Retry</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900">
          <span>Total {total} email transmissions</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1 || isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono">
              Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
            </span>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= total || isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
