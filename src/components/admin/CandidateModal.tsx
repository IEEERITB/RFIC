"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  Award,
  ExternalLink,
  Calendar,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  category: string;
  institutionOrCompany: string;
  ieeeMember: boolean;
  ieeeMembershipId?: string | null;
  githubHandle?: string | null;
  linkedinUrl?: string | null;
  experienceLevel: string;
  registrationDate: string | Date;
  status: string;
  emailStatus?: string;
  emailSentAt?: string | Date | null;
  emailLogs?: Array<{
    id: string;
    subject: string;
    status: string;
    sentAt: string | Date;
    error?: string | null;
  }>;
}

interface CandidateModalProps {
  candidate: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: (candidate: Participant) => void;
  onDelete: (id: string, name: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export function CandidateModal({
  candidate,
  isOpen,
  onClose,
  onSendEmail,
  onDelete,
  onUpdateStatus,
}: CandidateModalProps) {
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    await onUpdateStatus(candidate.id, newStatus);
    setUpdating(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Candidate Profile Dossier
              </h3>
              <p className="text-xs text-slate-400 font-mono">ID: {candidate.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white">{candidate.fullName}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-sky-400">
                  <Mail size={12} />
                  <span>{candidate.email}</span>
                </span>
                {candidate.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Phone size={12} />
                      <span>{candidate.phone}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={candidate.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="WAITLISTED">WAITLISTED</option>
                <option value="ATTENDED">ATTENDED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building size={13} className="text-teal-400" />
                <span>Institution / Company</span>
              </div>
              <div className="font-semibold text-slate-200">{candidate.institutionOrCompany}</div>
              <div className="text-xs text-slate-400">{candidate.category}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award size={13} className="text-amber-400" />
                <span>Experience Level</span>
              </div>
              <div className="font-semibold text-slate-200">{candidate.experienceLevel}</div>
              <div className="text-xs text-slate-400">Assigned Curriculum Track</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>IEEE Membership</span>
              </div>
              <div className="font-semibold text-slate-200">
                {candidate.ieeeMember ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Verified Member</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Non-Member</span>
                )}
              </div>
              {candidate.ieeeMembershipId ? (
                <div className="text-xs font-mono text-slate-400">ID: #{candidate.ieeeMembershipId}</div>
              ) : (
                <div className="text-xs text-slate-500">No member ID provided</div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-400" />
                <span>Registration Timestamp</span>
              </div>
              <div className="font-semibold text-slate-200">
                {format(new Date(candidate.registrationDate), "MMM d, yyyy")}
              </div>
              <div className="text-xs font-mono text-slate-400">
                {format(new Date(candidate.registrationDate), "HH:mm:ss 'UTC'")}
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Profiles & Code Repositories
            </span>
            <div className="flex flex-wrap gap-3">
              {candidate.linkedinUrl ? (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-800 text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-xs text-slate-500">No LinkedIn profile provided</span>
              )}

              {candidate.githubHandle ? (
                <a
                  href={
                    candidate.githubHandle.startsWith("http")
                      ? candidate.githubHandle
                      : `https://github.com/${candidate.githubHandle}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-teal-400 hover:text-teal-300 text-xs font-mono transition-colors"
                >
                  <span>GitHub: {candidate.githubHandle}</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-xs text-slate-500">No GitHub provided</span>
              )}
            </div>
          </div>

          {/* Email Delivery State & History */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail size={13} className="text-sky-400" />
                <span>Confirmation Email Status</span>
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  candidate.emailStatus === "SENT" || candidate.emailStatus === "DELIVERED"
                    ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                    : candidate.emailStatus === "FAILED"
                    ? "bg-red-950 text-red-400 border-red-800"
                    : "bg-amber-950 text-amber-400 border-amber-800"
                }`}
              >
                {candidate.emailStatus || "PENDING"}
              </span>
            </div>

            {candidate.emailSentAt && (
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} className="text-slate-500" />
                <span>Last Dispatched: {format(new Date(candidate.emailSentAt), "MMM d, yyyy HH:mm")}</span>
              </div>
            )}

            {/* Email Logs Snippet */}
            {candidate.emailLogs && candidate.emailLogs.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Dispatch Log History:
                </span>
                {candidate.emailLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    <div className="truncate max-w-[280px]">
                      <span className="font-medium text-slate-300">{log.subject}</span>
                      {log.error && <span className="text-red-400 block text-[10px]">{log.error}</span>}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {format(new Date(log.sentAt), "MM/dd HH:mm")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Confirmation Warning */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle size={16} className="text-red-400" />
                <span>Confirm Candidate Record Deletion</span>
              </div>
              <p className="text-xs leading-relaxed text-red-300">
                Are you sure you want to delete <strong>{candidate.fullName}</strong> ({candidate.email})? This action cannot be undone and will permanently remove this participant from the masterclass registry.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(candidate.id, candidate.fullName);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, Delete Record
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete Record</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onSendEmail(candidate);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Send size={13} />
              <span>{candidate.emailStatus === "SENT" ? "Resend Confirmation" : "Send Confirmation"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
