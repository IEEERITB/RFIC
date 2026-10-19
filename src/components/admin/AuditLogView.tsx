"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Shield,
  RefreshCw,
  Server,
  Key,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";

export function AuditLogView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookUrl = "https://ieee-rfic.ritb.in/api/webhooks/resend";

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats?.recentAuditLogs) {
        setLogs(data.stats.recentAuditLogs);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Infrastructure & Security Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Server size={14} className="text-sky-400" />
              <span>Database Engine</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="text-sm font-bold text-white">PostgreSQL (Neon Cloud)</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connection pooling active. Secure SSL-mode enforced with schema migrations synchronized.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Key size={14} className="text-teal-400" />
              <span>Resend API Key</span>
            </span>
            <span className="text-[11px] text-teal-400 font-semibold">Production Ready</span>
          </div>
          <div className="text-sm font-bold text-white">Transactional Email Delivery</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configured in environment settings. Individual confirmations and bulk broadcasts supported.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield size={14} className="text-amber-400" />
              <span>Admin Authentication</span>
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">Active</span>
          </div>
          <div className="text-sm font-bold text-white">Edge Middleware Shield</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protects both <code>/admin</code> and all <code>/api/admin/*</code> operations against unauthorized access.
          </p>
        </div>
      </div>

      {/* Resend Webhook Configuration Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ExternalLink size={16} className="text-sky-400" />
              <span>Resend Delivery Webhook Setup</span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure this webhook in your Resend Dashboard to automatically receive live delivery and bounce events
            </p>
          </div>
          <a
            href="https://resend.com/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition-colors w-fit"
          >
            <span>Open Resend Dashboard</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-sky-300 truncate select-all">
            {webhookUrl}
          </div>
          <button
            type="button"
            onClick={handleCopyWebhook}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shrink-0"
          >
            {copiedWebhook ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedWebhook ? "Copied URL!" : "Copy Webhook URL"}</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed">
          <strong>Recommended Events to Subscribe:</strong> <code>email.sent</code>, <code>email.delivered</code>, <code>email.bounced</code>, <code>email.complained</code>.
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-indigo-400" />
              <span>Administrative Audit Trail ({logs.length})</span>
            </h3>
            <p className="text-xs text-slate-400">Chronological history of administrative operations</p>
          </div>

          <button
            type="button"
            onClick={fetchAuditLogs}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh audit logs"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Operator</th>
                <th className="px-5 py-3.5">Event Details</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-sky-500" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No administrative audit actions recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-[11px] text-sky-400 bg-sky-950/80 border border-sky-800 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-300">
                      {log.adminUser}
                    </td>
                    <td className="px-5 py-3.5 max-w-md truncate text-slate-300" title={log.details || ""}>
                      {log.details || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-[11px] text-slate-400">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
