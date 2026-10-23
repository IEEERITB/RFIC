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
  Copy,
  Check,
  Edit3,
} from "lucide-react";
import { format } from "date-fns";
import { Participant } from "./CandidateModal";
import { useToast } from "@/hooks/use-toast";
import { CustomEmailStudio } from "./CustomEmailStudio";

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
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"broadcast" | "logs" | "engine">("broadcast");
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    configured?: boolean;
    user?: string;
    requiresAppPassword?: boolean;
  } | null>(null);

  const handleTestConnection = useCallback(async () => {
    setTestingConnection(true);
    try {
      const res = await fetch("/api/admin/email/test-connection");
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Failed to reach test endpoint",
      });
    } finally {
      setTestingConnection(false);
    }
  }, []);

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
    handleTestConnection();
  }, [fetchLogs, handleTestConnection]);

  const handleRetry = async (log: EmailLog) => {
    setRetryingId(log.id);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: log.participant?.id,
          email: log.recipientEmail,
          fullName: log.recipientName || "Candidate",
          subject: log.subject,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast({
          title: "Email Delivered",
          description: `Dispatched to ${log.recipientEmail}`,
          className: "bg-emerald-600 text-white border-none",
        });
        fetchLogs();
      } else {
        toast({
          title: "Dispatch Failed",
          description: result.error || "Failed to deliver email",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Retry failed:", err);
      toast({
        title: "Retry Error",
        description: err.message || "Network error while retrying email dispatch",
        variant: "destructive",
      });
    } finally {
      setRetryingId(null);
    }
  };

  const copyVercelConfig = () => {
    const config = `SMTP_HOST=smtp.gmail.com\nSMTP_PORT=465\nSMTP_SECURE=true\nSMTP_USER=rfic.ieeescritb@gmail.com\nSMTP_PASS=nhwhvhnnuvfwnwwz\nEMAIL_FROM="IEEE Sensors Council RIT-B" <rfic.ieeescritb@gmail.com>`;
    navigator.clipboard.writeText(config);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 3000);
    toast({
      title: "Config Copied to Clipboard",
      description: "Paste these environment variables into your Vercel Project Settings.",
      className: "bg-sky-600 text-white border-none",
    });
  };

  const pendingEmailCandidates = participants.filter(
    (p) => !p.emailStatus || p.emailStatus === "PENDING" || p.emailStatus === "FAILED"
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Sub-Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => setActiveSubTab("broadcast")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "broadcast"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <Sparkles size={14} className={activeSubTab === "broadcast" ? "text-white" : "text-sky-400"} />
            <span>Custom Broadcast Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("logs")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "logs"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <Mail size={14} className={activeSubTab === "logs" ? "text-white" : "text-slate-400"} />
            <span>Delivery Ledger & Logs ({total})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("engine")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "engine"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <ShieldAlert size={14} className={activeSubTab === "engine" ? "text-white" : "text-slate-400"} />
            <span>SMTP Engine Diagnostics</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab !== "broadcast" && (
            <button
              type="button"
              onClick={() => setActiveSubTab("broadcast")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
            >
              <Edit3 size={13} />
              <span>Draft Custom Email</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Custom Broadcast Studio */}
      {activeSubTab === "broadcast" && (
        <CustomEmailStudio onEmailDispatched={fetchLogs} />
      )}

      {/* Tab 2 or 3: Campaign Launcher & SMTP Engine Card */}
      {(activeSubTab === "logs" || activeSubTab === "engine") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 border border-sky-800/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950 border border-sky-800 px-3 py-1 rounded-full inline-block">
                Standard Registration Blasts
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Masterclass Communication Center
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Send branded registration confirmations, weekend lecture links, and official MPW tape-out notifications directly to registered candidates via Google SMTP.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => onOpenSendEmail(participants)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send size={13} />
                <span>Broadcast Confirmation to All ({participants.length})</span>
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

              <button
                type="button"
                onClick={() => setActiveSubTab("broadcast")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-all ml-auto"
              >
                <Sparkles size={13} />
                <span>Open Custom Broadcast Studio</span>
              </button>
            </div>
          </div>

          {/* Email Engine Status Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mail Delivery Engine</span>
                {testResult?.success ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    SMTP Connected
                  </span>
                ) : testResult?.configured === false ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Env Missing (Vercel)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    Google SMTP (Active)
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Sender Identity:</span>
                  <span className="text-sky-300 font-mono text-[11px] font-semibold">
                    {testResult?.user || "rfic.ieeescritb@gmail.com"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Host / Port:</span>
                  <span className="text-slate-200 font-medium font-mono text-[11px]">smtp.gmail.com:465 (SSL)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Template Engine:</span>
                  <span className="text-teal-400 font-semibold">React Email Components</span>
                </div>
              </div>
            </div>

            {/* Test Connection Button & Result */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 transition-all disabled:opacity-50"
              >
                {testingConnection ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-sky-400" />
                    <span>Verifying SMTP Auth...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Test SMTP Connection</span>
                  </>
                )}
              </button>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed border ${
                    testResult.success
                      ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
                      : testResult.requiresAppPassword
                      ? "bg-amber-950/60 border-amber-800/80 text-amber-200"
                      : "bg-rose-950/60 border-rose-800/80 text-rose-200"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {testResult.success ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="text-amber-400 shrink-0" />
                    )}
                    <span>
                      {testResult.success
                        ? "SMTP Verified Successfully!"
                        : testResult.requiresAppPassword
                        ? "Google 2FA App Password Required"
                        : "SMTP Connection Issue"}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{testResult.message}</p>
                  {testResult.requiresAppPassword && (
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-sky-400 hover:underline"
                    >
                      <span>Generate App Password (Google Account)</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {testResult.configured === false && (
                    <div className="mt-2.5 pt-2 border-t border-rose-900/40 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={copyVercelConfig}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-semibold transition-all"
                      >
                        {copiedEnv ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedEnv ? "Copied!" : "Copy Vercel Env Vars"}</span>
                      </button>
                      <a
                        href="https://vercel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:underline"
                      >
                        <span>Vercel Dashboard</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* When on Logs or Engine tab, render delivery table */}
      {(activeSubTab === "logs" || activeSubTab === "engine") && (
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
                <th className="px-5 py-3.5">Provider Message ID</th>
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
      )}
    </div>
  );
}
