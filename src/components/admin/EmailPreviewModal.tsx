"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  Eye,
  Edit3,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Array<{
    id: string;
    email: string;
    fullName: string;
    category?: string;
    institutionOrCompany?: string;
  }>;
  onConfirmSend: (params: {
    subject: string;
    customMessage?: string;
    templateType?: "CONFIRMATION" | "CUSTOM_BROADCAST";
    headline?: string;
    badgeText?: string;
    bodyContent?: string;
    ctaText?: string;
    ctaUrl?: string;
    additionalNote?: string;
  }) => Promise<void>;
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  recipients,
  onConfirmSend,
}: EmailPreviewModalProps) {
  const { toast } = useToast();

  // Template Type: Confirmation vs Custom Broadcast
  const [templateType, setTemplateType] = useState<"CONFIRMATION" | "CUSTOM_BROADCAST">("CONFIRMATION");

  // Fields
  const [subject, setSubject] = useState("Registration Confirmed: IEEE RF IC Design Masterclass");
  const [headline, setHeadline] = useState("Important Masterclass Update & Guidelines");
  const [badgeText, setBadgeText] = useState("OFFICIAL UPDATE");
  const [bodyContent, setBodyContent] = useState(
    "We are pleased to share key logistical and technical updates regarding the IEEE RF IC Design Masterclass on Open-Source Silicon.\n\nPlease ensure your open-source toolchain (Xschem, Ngspice, KLayout) is installed ahead of the live hands-on modules."
  );
  const [customMessage, setCustomMessage] = useState("");
  const [includeCta, setIncludeCta] = useState(true);
  const [ctaText, setCtaText] = useState("Join Official WhatsApp Community");
  const [ctaUrl, setCtaUrl] = useState("https://chat.whatsapp.com/JfuZqkbQqv1Elf2igdXFwS");
  const [includeNote, setIncludeNote] = useState(false);
  const [additionalNote, setAdditionalNote] = useState("");

  // Test send state
  const [testEmail, setTestEmail] = useState("rfic.ieeescritb@gmail.com");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Modal View Modes
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || recipients.length === 0) return null;

  const isBulk = recipients.length > 1;
  const sampleCandidate = recipients[0];

  const handleTemplateSwitch = (type: "CONFIRMATION" | "CUSTOM_BROADCAST") => {
    setTemplateType(type);
    if (type === "CONFIRMATION") {
      setSubject("Registration Confirmed: IEEE RF IC Design Masterclass");
    } else {
      setSubject("Important Masterclass Update: IEEE RF IC Design Series");
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "test",
          testEmail: testEmail.trim(),
          templateType,
          subject,
          headline,
          badgeText,
          bodyContent: templateType === "CUSTOM_BROADCAST" ? bodyContent : undefined,
          customMessage: templateType === "CONFIRMATION" ? customMessage : undefined,
          ctaText: includeCta ? ctaText : undefined,
          ctaUrl: includeCta ? ctaUrl : undefined,
          additionalNote: includeNote ? additionalNote : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: "Test Dispatched!",
          description: `Sample sent to ${testEmail}`,
          className: "bg-emerald-600 text-white border-none",
        });
      } else {
        throw new Error(data.error || "Failed to send test email");
      }
    } catch (err: any) {
      toast({
        title: "Test Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onConfirmSend({
        templateType,
        subject,
        headline: templateType === "CUSTOM_BROADCAST" ? headline : undefined,
        badgeText: templateType === "CUSTOM_BROADCAST" ? badgeText : undefined,
        bodyContent: templateType === "CUSTOM_BROADCAST" ? bodyContent : undefined,
        customMessage: templateType === "CONFIRMATION" ? (customMessage.trim() || undefined) : undefined,
        ctaText: includeCta ? ctaText : undefined,
        ctaUrl: includeCta ? ctaUrl : undefined,
        additionalNote: includeNote ? additionalNote : undefined,
      });
      onClose();
    } catch (err) {
      console.error("Failed to send email:", err);
    } finally {
      setIsSending(false);
    }
  };

  const previewCustomBody = bodyContent
    .replace(/\{\{\s*name\s*\}\}/gi, sampleCandidate.fullName)
    .replace(/\{\{\s*email\s*\}\}/gi, sampleCandidate.email)
    .replace(/\{\{\s*category\s*\}\}/gi, sampleCandidate.category || "Candidate")
    .replace(/\{\{\s*institution\s*\}\}/gi, sampleCandidate.institutionOrCompany || "Academic Institution");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isBulk ? `Email Dispatch (${recipients.length} Candidates)` : "Send Candidate Email"}
              </h3>
              <p className="text-xs text-slate-400">
                {isBulk
                  ? `Recipients: ${sampleCandidate.email} + ${recipients.length - 1} more`
                  : `Recipient: ${sampleCandidate.fullName} <${sampleCandidate.email}>`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "preview" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "edit" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Edit3 size={13} />
                <span>Customize & Edit</span>
              </button>
            </div>

            <button
              onClick={onClose}
              disabled={isSending}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Template Type Selector Tabs */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              Template Format:
            </span>
            <button
              type="button"
              onClick={() => handleTemplateSwitch("CONFIRMATION")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                templateType === "CONFIRMATION"
                  ? "bg-sky-950 text-sky-400 border border-sky-800"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Registration Confirmation
            </button>
            <button
              type="button"
              onClick={() => handleTemplateSwitch("CUSTOM_BROADCAST")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                templateType === "CUSTOM_BROADCAST"
                  ? "bg-sky-950 text-sky-400 border border-sky-800"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Custom Update / Announcement
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            Targeting <strong>{recipients.length}</strong> candidate(s)
          </span>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {activeTab === "edit" ? (
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Subject line..."
                />
              </div>

              {/* Template Specific Inputs */}
              {templateType === "CUSTOM_BROADCAST" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Announcement Headline
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="e.g. Masterclass Lecture Link & EDA Setup Guide"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Tag / Badge
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs uppercase focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="OFFICIAL UPDATE"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Announcement Message Body (Multiline)
                    </label>
                    <textarea
                      value={bodyContent}
                      onChange={(e) => setBodyContent(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                      placeholder="Draft your announcement text here..."
                    />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeCta}
                        onChange={(e) => setIncludeCta(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-white">Include Action Button</span>
                    </label>
                    {includeCta && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                        <input
                          type="text"
                          value={ctaText}
                          onChange={(e) => setCtaText(e.target.value)}
                          placeholder="Button Label (e.g. Join WhatsApp)"
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="url"
                          value={ctaUrl}
                          onChange={(e) => setCtaUrl(e.target.value)}
                          placeholder="Button Link (https://...)"
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Optional Custom Message / Announcement
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                    placeholder="Add any specific instructions, Zoom link reminders, or personalized note to be prominently highlighted in the confirmation email..."
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    This custom message will be rendered inside an official highlight alert box in the email template.
                  </p>
                </div>
              )}

              {/* Test preview send */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Send a sample to test inbox:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-48"
                  />
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={isSendingTest}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs"
                  >
                    {isSendingTest ? "Sending..." : "Test"}
                  </button>
                </div>
              </div>

              {/* Recipient breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Recipient Preview ({recipients.length})
                </span>
                <div className="max-h-28 overflow-y-auto divide-y divide-slate-800 text-xs">
                  {recipients.map((r) => (
                    <div key={r.id} className="py-1.5 flex justify-between items-center text-slate-300">
                      <span className="font-medium text-white">{r.fullName}</span>
                      <span className="font-mono text-slate-400">{r.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* HTML Preview Box */
            <div className="border border-slate-800 rounded-2xl bg-white text-slate-900 p-6 shadow-inner space-y-4 max-w-xl mx-auto font-sans">
              <div className="bg-[#0a192f] p-4 text-center rounded-xl text-white border-b-4 border-sky-600">
                <div className="text-[10px] font-bold text-sky-400 tracking-widest uppercase">
                  IEEE BANGALORE SECTION & IEEE SENSORS COUNCIL RIT-B
                </div>
                <h4 className="text-lg font-black text-white mt-1">IEEE RF IC Design Masterclass</h4>
                <div className="text-xs text-slate-300">
                  5G/6G Physical Silicon Tape-Out Track • {templateType === "CUSTOM_BROADCAST" ? "Official Announcement" : "Registration Confirmation"}
                </div>
              </div>

              {templateType === "CUSTOM_BROADCAST" ? (
                /* Custom Broadcast Preview */
                <div className="space-y-3 pt-2">
                  <div className="bg-sky-50 border-b border-sky-100 p-3 rounded-lg">
                    {badgeText && (
                      <span className="inline-block bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        {badgeText}
                      </span>
                    )}
                    <h5 className="text-sm font-extrabold text-sky-950">
                      {headline || subject}
                    </h5>
                  </div>

                  <h6 className="text-base font-extrabold text-slate-900">
                    Hello, {sampleCandidate.fullName}!
                  </h6>

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                    {previewCustomBody}
                  </div>

                  {includeCta && ctaText && (
                    <div className="text-center pt-2 pb-1">
                      <span className="inline-block bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm">
                        {ctaText}
                      </span>
                    </div>
                  )}

                  {includeNote && additionalNote && (
                    <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-950 font-medium">
                      <strong>Important: </strong>{additionalNote}
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
                    <div><strong>Recipient:</strong> {sampleCandidate.fullName}</div>
                    <div><strong>Email:</strong> {sampleCandidate.email}</div>
                    <div><strong>Affiliation:</strong> {sampleCandidate.institutionOrCompany}</div>
                  </div>
                </div>
              ) : (
                /* Confirmation Template Preview */
                <div className="space-y-3 pt-2">
                  <h5 className="text-base font-extrabold text-slate-900">
                    Welcome, {sampleCandidate.fullName}!
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Your seat for the <strong>IEEE Bangalore Section Flagship Micro-Specialization Track on RF IC Design for 5G/6G on Open-Source Silicon</strong> has been successfully confirmed.
                  </p>

                  {customMessage && (
                    <div className="p-3 bg-sky-50 border-l-4 border-sky-600 rounded text-xs text-sky-950 font-medium">
                      <div className="font-bold text-[10px] text-sky-800 uppercase">Special Announcement:</div>
                      <div>{customMessage}</div>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div><strong>Name:</strong> {sampleCandidate.fullName}</div>
                    <div><strong>Email:</strong> {sampleCandidate.email}</div>
                    <div><strong>Track:</strong> Open-Source EDA & 130nm MPW Tape-Out</div>
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-400 rounded-xl text-xs space-y-2">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
                        Compulsory
                      </span>
                      <span>Join Official WhatsApp Community</span>
                    </div>
                    <p className="text-emerald-900 text-[11px] leading-relaxed">
                      Live Zoom lecture links, EDA lab credentials, and tape-out files are distributed exclusively here.
                    </p>
                    <div className="text-center pt-1">
                      <span className="inline-block bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm">
                        Join Official WhatsApp Group
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Subject: <strong>{subject}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Ready to dispatch via Google SMTP (rfic.ieeescritb@gmail.com)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Sending {recipients.length} Email(s)...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Confirm & Send {isBulk ? `(${recipients.length})` : "Now"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
