"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Send,
  Eye,
  Edit3,
  Mail,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Check,
  ExternalLink,
  Save,
  Trash2,
  Layers,
  Link as LinkIcon,
  HelpCircle,
  UserCheck,
  Clock,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParticipantRecipient {
  id: string;
  fullName: string;
  email: string;
  category?: string;
  institutionOrCompany?: string;
  status: string;
  emailStatus?: string | null;
  registrationDate: string;
}

interface CustomEmailStudioProps {
  onEmailDispatched?: () => void;
}

const TEMPLATE_PRESETS = [
  {
    id: "general_update",
    name: "General Masterclass Update",
    icon: "📢",
    badge: "OFFICIAL UPDATE",
    subject: "Important Masterclass Update: IEEE RF IC Design Series",
    headline: "Welcome & Masterclass Technical Orientation",
    bodyContent: `Dear {{name}},

We are thrilled to welcome you to the IEEE RF IC Design Masterclass for 5G/6G on Open-Source Silicon.

As we gear up for the live sessions, please review the key reminders below:
1. Live lectures take place every Saturday & Sunday from 7:30 PM to 9:30 PM IST.
2. Ensure you have joined our official WhatsApp community where meeting credentials and EDA instructions are shared.
3. Interactive lab sessions will utilize zero-license open-source toolchains including Xschem, Ngspice, openEMS, and KLayout.

We look forward to an enriching silicon design journey together!`,
    ctaText: "Join WhatsApp Community",
    ctaUrl: "https://chat.whatsapp.com/H8zM8URfnS98mMCONT2E2L",
    note: "All live meeting links and virtual machine access tokens will be announced inside the community group.",
  },
  {
    id: "session_link",
    name: "Live Session Link & Joining Info",
    icon: "🚀",
    badge: "WEEKEND SESSION LINK",
    subject: "Joining Link: IEEE RF IC Design Masterclass Live Session",
    headline: "Live Online Session Access Details",
    bodyContent: `Hello {{name}},

Your upcoming live online masterclass session is scheduled for this weekend.

📅 Timing: Saturday & Sunday • From 7:30 PM IST (UTC+5:30)
🎙️ Session Topic: Architecture & Open-Source Silicon Toolchain
💻 Platform: Google Meet / Zoom Live Interactive Broadcast

Please join 5–10 minutes early to test your audio and ensure your open-source EDA environment is ready.`,
    ctaText: "Join Live Masterclass Session",
    ctaUrl: "https://meet.google.com/sample-session-link",
    note: "Please keep your mic muted upon entry. You can use the live Q&A chat to post your design queries.",
  },
  {
    id: "eda_toolchain",
    name: "FOSS EDA Toolchain & VM Setup",
    icon: "💻",
    badge: "LAB ENVIRONMENT SETUP",
    subject: "Toolchain Setup: Xschem, Ngspice & IHP SG13G2 PDK",
    headline: "EDA Toolchain & VM Environment Setup Guide",
    bodyContent: `Dear {{name}},

Ahead of our hands-on circuit simulation modules, please ensure your design environment is properly configured.

We have prepared pre-configured Linux Virtual Machine images and Docker containers containing:
• Xschem (Schematic Capture)
• Ngspice (Simulation & S-Parameter Engine)
• openEMS (3D Electromagnetic Solvers)
• KLayout (Physical Layout & Geometry DRC/LVS)

Follow the complete step-by-step setup documentation linked below.`,
    ctaText: "Access EDA Setup Guide & VM",
    ctaUrl: "https://ieee-rfic.ritb.in/#toolchain",
    note: "Docker images are compatible with Windows (WSL2), macOS (Apple Silicon/Intel), and native Linux.",
  },
  {
    id: "tapeout_submission",
    name: "Tape-Out Submission & Deadlines",
    icon: "🏆",
    badge: "TAPE-OUT NOTICE",
    subject: "Tape-Out Pipeline: MPW Submission Guidelines & Deadlines",
    headline: "Silicon Tape-Out Submission Guidelines",
    bodyContent: `Dear {{name}},

Congratulations on progressing through the RF IC design modules!

Submissions for the Flagship Silicon Capstone Tape-Out Distinction are now open:
• DRC & LVS Clean Verification is mandatory
• Submissions must include GDSII layout, netlists, and testbench reports
• Top validated student and faculty designs will be selected for physical MPW wafer fabrication on IHP 130nm BiCMOS shuttle.`,
    ctaText: "Submit Design Dossier",
    ctaUrl: "https://ieee-rfic.ritb.in/#curriculum",
    note: "All design files must adhere strictly to the foundry design rule checklist.",
  },
  {
    id: "blank",
    name: "Blank Canvas (Draft from Scratch)",
    icon: "✍️",
    badge: "ANNOUNCEMENT",
    subject: "",
    headline: "",
    bodyContent: "",
    ctaText: "",
    ctaUrl: "",
    note: "",
  },
];

const LOCAL_STORAGE_KEY = "rfic_custom_email_draft_v1";

export function CustomEmailStudio({ onEmailDispatched }: CustomEmailStudioProps) {
  const { toast } = useToast();

  // Audience State
  const [audience, setAudience] = useState<"ALL" | "NEW" | "CONFIRMED" | "STUDENTS" | "FACULTY_INDUSTRY" | "CUSTOM">("ALL");
  const [recipients, setRecipients] = useState<ParticipantRecipient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [recipientSearch, setRecipientSearch] = useState("");
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [segmentCounts, setSegmentCounts] = useState<{ all: number; unsent: number; confirmed: number }>({
    all: 0,
    unsent: 0,
    confirmed: 0,
  });

  // Draft Editor State
  const [subject, setSubject] = useState("Important Masterclass Update: IEEE RF IC Design Series");
  const [headline, setHeadline] = useState("Important Masterclass Technical Orientation & Updates");
  const [badgeText, setBadgeText] = useState("OFFICIAL UPDATE");
  const [bodyContent, setBodyContent] = useState(
    `Dear {{name}},\n\nWe are pleased to share key logistical and technical updates regarding the upcoming IEEE RF IC Design Masterclass on Open-Source Silicon.\n\nAll registered candidates are requested to confirm their presence in the official WhatsApp community for lecture links and lab credentials.`
  );
  const [includeCta, setIncludeCta] = useState(true);
  const [ctaText, setCtaText] = useState("Join Official WhatsApp Community");
  const [ctaUrl, setCtaUrl] = useState("https://chat.whatsapp.com/H8zM8URfnS98mMCONT2E2L");
  const [includeNote, setIncludeNote] = useState(false);
  const [additionalNote, setAdditionalNote] = useState("");

  // Editor View Mode
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Dispatch States
  const [testEmail, setTestEmail] = useState("rfic.ieeescritb@gmail.com");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState<{
    sent: number;
    failed: number;
    total: number;
    currentBatch: number;
    totalBatches: number;
  } | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelDispatch, setCancelDispatch] = useState(false);

  // Load saved draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.headline) setHeadline(parsed.headline);
        if (parsed.badgeText) setBadgeText(parsed.badgeText);
        if (parsed.bodyContent) setBodyContent(parsed.bodyContent);
        if (parsed.includeCta !== undefined) setIncludeCta(parsed.includeCta);
        if (parsed.ctaText) setCtaText(parsed.ctaText);
        if (parsed.ctaUrl) setCtaUrl(parsed.ctaUrl);
        if (parsed.includeNote !== undefined) setIncludeNote(parsed.includeNote);
        if (parsed.additionalNote) setAdditionalNote(parsed.additionalNote);
      }
    } catch (e) {
      console.warn("Failed to read draft from localStorage:", e);
    }
  }, []);

  // Save draft on edit
  const saveDraftToStorage = useCallback(() => {
    try {
      const draft = {
        subject,
        headline,
        badgeText,
        bodyContent,
        includeCta,
        ctaText,
        ctaUrl,
        includeNote,
        additionalNote,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn("Failed to save draft:", e);
    }
  }, [subject, headline, badgeText, bodyContent, includeCta, ctaText, ctaUrl, includeNote, additionalNote]);

  useEffect(() => {
    saveDraftToStorage();
  }, [saveDraftToStorage]);

  // Fetch recipients based on audience
  const fetchRecipients = useCallback(async () => {
    setIsLoadingRecipients(true);
    try {
      const params = new URLSearchParams({
        audience,
        search: recipientSearch.trim(),
      });
      const res = await fetch(`/api/admin/email/recipients?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecipients(data.data || []);
        if (data.counts) {
          setSegmentCounts(data.counts);
        }
        // If in custom mode, keep selection; otherwise, select all in list
        if (audience !== "CUSTOM") {
          setSelectedIds(new Set((data.data || []).map((r: ParticipantRecipient) => r.id)));
        }
      }
    } catch (err) {
      console.error("Failed to fetch recipients:", err);
    } finally {
      setIsLoadingRecipients(false);
    }
  }, [audience, recipientSearch]);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  // Apply template preset
  const handleApplyTemplate = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setSubject(preset.subject);
    setHeadline(preset.headline);
    setBadgeText(preset.badge);
    setBodyContent(preset.bodyContent);
    if (preset.ctaText && preset.ctaUrl) {
      setIncludeCta(true);
      setCtaText(preset.ctaText);
      setCtaUrl(preset.ctaUrl);
    } else {
      setIncludeCta(false);
    }
    if (preset.note) {
      setIncludeNote(true);
      setAdditionalNote(preset.note);
    } else {
      setIncludeNote(false);
      setAdditionalNote("");
    }
    toast({
      title: `Applied Template: ${preset.name}`,
      description: "You can now edit and customize every aspect before sending.",
      className: "bg-sky-600 text-white border-none",
    });
  };

  // Insert personalized tag at cursor
  const handleInsertTag = (tag: string) => {
    setBodyContent((prev) => `${prev} ${tag} `);
  };

  // Filtered target list
  const targetedRecipients = useMemo(() => {
    if (audience === "CUSTOM") {
      return recipients.filter((r) => selectedIds.has(r.id));
    }
    return recipients;
  }, [audience, recipients, selectedIds]);

  // Toggle recipient selection
  const handleToggleRecipient = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(recipients.map((r) => r.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // Test email sender
  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address to receive the test preview.",
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
          templateType: "CUSTOM_BROADCAST",
          testEmail: testEmail.trim(),
          subject,
          headline,
          badgeText,
          bodyContent,
          ctaText: includeCta ? ctaText : undefined,
          ctaUrl: includeCta ? ctaUrl : undefined,
          additionalNote: includeNote ? additionalNote : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: "Test Email Dispatched!",
          description: `Delivered test preview directly to ${testEmail}. Check your inbox!`,
          className: "bg-emerald-600 text-white border-none",
        });
      } else {
        throw new Error(data.error || "Failed to send test email");
      }
    } catch (err: any) {
      toast({
        title: "Test Send Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Mass dispatch execution in safe chunks of 20
  const handleExecuteMassDispatch = async () => {
    setConfirmModalOpen(false);

    if (targetedRecipients.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select at least one recipient candidate before dispatching.",
        variant: "destructive",
      });
      return;
    }

    setIsDispatching(true);
    setCancelDispatch(false);

    const BATCH_SIZE = 20;
    const total = targetedRecipients.length;
    const totalBatches = Math.ceil(total / BATCH_SIZE);

    let sentCount = 0;
    let failedCount = 0;

    setDispatchProgress({
      sent: 0,
      failed: 0,
      total,
      currentBatch: 0,
      totalBatches,
    });

    try {
      for (let i = 0; i < totalBatches; i++) {
        if (cancelDispatch) {
          toast({
            title: "Dispatch Paused / Cancelled",
            description: `Cancelled after processing ${sentCount} emails.`,
            className: "bg-amber-600 text-white border-none",
          });
          break;
        }

        const batchRecipients = targetedRecipients.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);

        setDispatchProgress({
          sent: sentCount,
          failed: failedCount,
          total,
          currentBatch: i + 1,
          totalBatches,
        });

        const res = await fetch("/api/admin/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateType: "CUSTOM_BROADCAST",
            recipients: batchRecipients,
            subject,
            headline,
            badgeText,
            bodyContent,
            ctaText: includeCta ? ctaText : undefined,
            ctaUrl: includeCta ? ctaUrl : undefined,
            additionalNote: includeNote ? additionalNote : undefined,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          sentCount += data.summary?.sent || batchRecipients.length;
          failedCount += data.summary?.failed || 0;
        } else {
          failedCount += batchRecipients.length;
          console.error("Batch failed:", data.error);
        }

        setDispatchProgress({
          sent: sentCount,
          failed: failedCount,
          total,
          currentBatch: i + 1,
          totalBatches,
        });
      }

      toast({
        title: "Broadcast Complete!",
        description: `Successfully delivered ${sentCount} custom emails to participants.`,
        className: "bg-emerald-600 text-white border-none",
      });

      // Notify parent to refresh logs & counts
      if (onEmailDispatched) {
        onEmailDispatched();
      }
      fetchRecipients();
    } catch (err: any) {
      console.error("Mass dispatch error:", err);
      toast({
        title: "Dispatch Interrupted",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsDispatching(false);
    }
  };

  // Sample recipient for preview substitution
  const sampleCandidate = targetedRecipients[0] || {
    id: "sample",
    fullName: "Priyanshu Trivedi",
    email: "trivedipriyanshu@ieee.org",
    category: "Student (UG / PG)",
    institutionOrCompany: "Ramaiah Institute of Technology (MSRIT)",
    status: "CONFIRMED",
    registrationDate: new Date().toISOString(),
  };

  const previewBody = bodyContent
    .replace(/\{\{\s*name\s*\}\}/gi, sampleCandidate.fullName)
    .replace(/\{\{\s*email\s*\}\}/gi, sampleCandidate.email)
    .replace(/\{\{\s*category\s*\}\}/gi, sampleCandidate.category || "Candidate")
    .replace(/\{\{\s*institution\s*\}\}/gi, sampleCandidate.institutionOrCompany || "Academic Institution");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Studio Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 border border-sky-800/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950 border border-sky-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-sky-400" />
              <span>Custom Broadcast Studio</span>
            </span>
            <span className="text-xs text-slate-400">
              • Draft, Preview, Edit & Mass-Send
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Draft & Send Custom Updates to Candidates
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Compose your own custom email announcement or technical notice with live variables, custom buttons, and branded IEEE layouts. Broadcast to all registered candidates or new registrants at once.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-all shadow-sm"
          >
            {activeTab === "edit" ? (
              <>
                <Eye size={14} />
                <span>Switch to Live Preview</span>
              </>
            ) : (
              <>
                <Edit3 size={14} />
                <span>Back to Draft Editor</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            disabled={isDispatching || targetedRecipients.length === 0}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Send size={14} />
            <span>Send to {targetedRecipients.length} Participants</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when mass dispatching */}
      {isDispatching && dispatchProgress && (
        <div className="p-5 rounded-2xl bg-sky-950/80 border border-sky-700 text-white space-y-3 shadow-xl animate-in zoom-in-95">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-sky-400" />
              <span>
                Dispatching Batch {dispatchProgress.currentBatch} of {dispatchProgress.totalBatches}...
              </span>
            </span>
            <span className="font-mono text-sky-300 font-semibold">
              {dispatchProgress.sent} sent / {dispatchProgress.total} total ({Math.round((dispatchProgress.sent / dispatchProgress.total) * 100)}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{
                width: `${Math.max(5, Math.min(100, (dispatchProgress.sent / dispatchProgress.total) * 100))}%`,
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-300">
            <span>
              Delivered: <strong className="text-emerald-400">{dispatchProgress.sent}</strong> | Failed:{" "}
              <strong className="text-rose-400">{dispatchProgress.failed}</strong>
            </span>
            <button
              type="button"
              onClick={() => setCancelDispatch(true)}
              className="text-amber-400 hover:underline font-semibold"
            >
              Cancel / Stop Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Audience Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              Step 1 • Target Audience
            </span>
            <h4 className="text-lg font-bold text-white">Select Recipient Group</h4>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total in Database:</span>
            <span className="font-bold font-mono text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {segmentCounts.all} Registered
            </span>
          </div>
        </div>

        {/* Audience Segment Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => setAudience("ALL")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              audience === "ALL"
                ? "bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/20 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="text-base mb-1">👥</div>
            <div className="font-bold text-xs">All Registered</div>
            <div className="text-[11px] text-sky-400 font-mono font-semibold mt-0.5">
              {segmentCounts.all} candidates
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAudience("NEW")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              audience === "NEW"
                ? "bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/20 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="text-base mb-1">🆕</div>
            <div className="font-bold text-xs">New / Unsent</div>
            <div className="text-[11px] text-amber-400 font-mono font-semibold mt-0.5">
              {segmentCounts.unsent} pending
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAudience("CONFIRMED")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              audience === "CONFIRMED"
                ? "bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/20 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="text-base mb-1">✅</div>
            <div className="font-bold text-xs">Confirmed Only</div>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">
              {segmentCounts.confirmed} confirmed
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAudience("STUDENTS")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              audience === "STUDENTS"
                ? "bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/20 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="text-base mb-1">🎓</div>
            <div className="font-bold text-xs">Students</div>
            <div className="text-[11px] text-slate-400 mt-0.5">UG / PG / Ph.D</div>
          </button>

          <button
            type="button"
            onClick={() => setAudience("FACULTY_INDUSTRY")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              audience === "FACULTY_INDUSTRY"
                ? "bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/20 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="text-base mb-1">💼</div>
            <div className="font-bold text-xs">Faculty & Industry</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Professionals</div>
          </button>

          <button
            type="button"
            onClick={() => setAudience("CUSTOM")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              audience === "CUSTOM"
                ? "bg-sky-950/80 border-sky-500 ring-2 ring-sky-500/20 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="text-base mb-1">🎯</div>
            <div className="font-bold text-xs">Custom Pick</div>
            <div className="text-[11px] text-teal-400 font-mono font-semibold mt-0.5">
              {selectedIds.size} selected
            </div>
          </button>
        </div>

        {/* Custom Picker Drawer */}
        {audience === "CUSTOM" && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, college..."
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold"
                >
                  Select All ({recipients.length})
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold"
                >
                  Clear Selection
                </button>
                <span className="text-slate-400 font-mono text-[11px]">
                  {selectedIds.size} chosen
                </span>
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto divide-y divide-slate-800/80 border border-slate-800 rounded-xl">
              {recipients.map((r) => {
                const isSelected = selectedIds.has(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => handleToggleRecipient(r.id)}
                    className={`p-2.5 px-3 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-900/80 transition-colors ${
                      isSelected ? "bg-sky-950/40 text-white" : "text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-sky-600 border-sky-500 text-white" : "border-slate-700 bg-slate-900"
                        }`}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                      <div>
                        <span className="font-semibold text-white mr-2">{r.fullName}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{r.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 max-w-[200px] truncate hidden sm:inline-block">
                      {r.institutionOrCompany}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Template Presets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              Step 2 • Ready Presets
            </span>
            <h4 className="text-lg font-bold text-white">Load a Quick Template</h4>
          </div>
          <span className="text-xs text-slate-400">Click any preset to prefill the draft</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TEMPLATE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyTemplate(p)}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-sky-500 hover:bg-slate-800/80 text-left transition-all group"
            >
              <div className="text-xl mb-1.5 group-hover:scale-110 transition-transform">{p.icon}</div>
              <div className="font-bold text-xs text-white mb-0.5">{p.name}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1">{p.subject || "Custom message"}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Editor & Live Preview (Side by Side or Tabbed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Editor */}
        <div
          className={`${
            activeTab === "preview" ? "hidden lg:block lg:col-span-6" : "lg:col-span-6"
          } bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-5`}
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                Step 3 • Draft Editor
              </span>
              <h4 className="text-lg font-bold text-white">Email Content & Messaging</h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Save size={12} className="text-emerald-400" />
                <span>Auto-saved to draft</span>
              </span>
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Subject Line <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Important Masterclass Update: Weekend Lecture Schedule & Links"
            />
          </div>

          {/* Headline & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Announcement Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. Technical Orientation & Joining Guidelines"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium text-xs uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="OFFICIAL UPDATE"
              />
            </div>
          </div>

          {/* Body Content with Variable Insertion Buttons */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Email Message Body <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Insert variable:</span>
                <button
                  type="button"
                  onClick={() => handleInsertTag("{{name}}")}
                  className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 hover:bg-sky-900 font-mono text-[10px]"
                >
                  + name
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag("{{category}}")}
                  className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 hover:bg-sky-900 font-mono text-[10px]"
                >
                  + category
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag("{{institution}}")}
                  className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 hover:bg-sky-900 font-mono text-[10px]"
                >
                  + institution
                </button>
              </div>
            </div>
            <textarea
              rows={8}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              placeholder="Draft your announcement message here. Separate paragraphs with double enter..."
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Supports multiline text, paragraphs, and dynamic variables like <code className="text-sky-400 font-mono">{"{{name}}"}</code>.
            </p>
          </div>

          {/* Optional Action Button */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCta}
                  onChange={(e) => setIncludeCta(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-white">Include Call-to-Action Button</span>
              </label>
              <span className="text-[11px] text-slate-500">e.g. WhatsApp, Zoom, Drive Link</span>
            </div>

            {includeCta && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="e.g. Join Official WhatsApp Community"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optional Highlight Note Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNote}
                onChange={(e) => setIncludeNote(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-white">Include Yellow Alert / Important Note Box</span>
            </label>

            {includeNote && (
              <input
                type="text"
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. Attendance is recorded automatically during live lecture sessions."
              />
            )}
          </div>

          {/* Pre-flight Test Send Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                Pre-Flight Inspection
              </span>
              <span className="text-xs text-slate-400">
                Send a sample copy to yourself before blasting:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono w-48 sm:w-56 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
              >
                {isSendingTest ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                <span>Send Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div
          className={`${
            activeTab === "edit" ? "hidden lg:block lg:col-span-6" : "lg:col-span-6"
          } bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4`}
        >
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                Interactive Email Preview
              </span>
              <h4 className="text-lg font-bold text-white">Recipient Inbox Appearance</h4>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  previewDevice === "desktop" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  previewDevice === "mobile" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Email Canvas */}
          <div className="p-4 sm:p-6 bg-slate-950/90 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
            <div
              className={`bg-white rounded-2xl border border-slate-200 text-slate-900 overflow-hidden shadow-2xl transition-all duration-300 font-sans ${
                previewDevice === "mobile" ? "max-w-[360px] w-full" : "max-w-[560px] w-full"
              }`}
            >
              {/* Email Brand Header */}
              <div className="bg-[#0a192f] p-5 text-center text-white border-b-4 border-sky-600">
                <div className="text-[9px] font-bold text-sky-400 tracking-widest uppercase">
                  IEEE BANGALORE SECTION & IEEE SENSORS COUNCIL RIT-B
                </div>
                <h4 className="text-base sm:text-lg font-black text-white mt-1 leading-snug">
                  IEEE RF IC Design Masterclass
                </h4>
                <div className="text-[11px] text-slate-300">
                  5G/6G Physical Silicon Tape-Out Track • Official Announcement
                </div>
              </div>

              {/* Announcement Banner Bar */}
              <div className="bg-sky-50 border-b border-sky-100 p-4">
                {badgeText && (
                  <span className="inline-block bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                    {badgeText}
                  </span>
                )}
                <h5 className="text-sm sm:text-base font-extrabold text-sky-950 leading-snug">
                  {headline || subject}
                </h5>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
                <div className="font-extrabold text-slate-900 text-base">
                  Hello, {sampleCandidate.fullName}!
                </div>

                <div className="text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                  {previewBody}
                </div>

                {/* Call to action button */}
                {includeCta && ctaText && (
                  <div className="text-center pt-3 pb-2">
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105"
                    >
                      {ctaText}
                    </a>
                  </div>
                )}

                {/* Important Note */}
                {includeNote && additionalNote && (
                  <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-950 font-medium">
                    <span className="font-bold text-[10px] text-amber-800 uppercase block mb-0.5">
                      Important Note:
                    </span>
                    <span>{additionalNote}</span>
                  </div>
                )}

                {/* Ledger card */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200">
                    Candidate Record
                  </div>
                  <div><strong>Recipient:</strong> {sampleCandidate.fullName}</div>
                  <div><strong>Email:</strong> {sampleCandidate.email}</div>
                  <div><strong>Affiliation:</strong> {sampleCandidate.institutionOrCompany}</div>
                </div>

                {/* Support signoff */}
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div>
                    Need assistance? Email us at <strong className="text-sky-600">rfic.ieeescritb@gmail.com</strong>
                  </div>
                  <div className="text-slate-700 font-semibold pt-1">
                    IEEE Sensors Council RIT-B & IEEE Bangalore Section
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Mass Sending */}
      {confirmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Confirm Mass Dispatch</h4>
                <p className="text-xs text-slate-400">You are about to launch a live broadcast campaign</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Audience Target:</span>
                <span className="font-bold text-white uppercase">{audience}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Recipients:</span>
                <span className="font-bold font-mono text-sky-400 text-sm">
                  {targetedRecipients.length} candidates
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Subject:</span>
                <span className="font-medium text-white max-w-[240px] truncate">{subject}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>SMTP Sender:</span>
                <span className="font-mono text-emerald-400">rfic.ieeescritb@gmail.com</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Emails will be dispatched in safe batches of 20 with live progress reporting. You can pause or cancel the broadcast at any moment.
            </p>

            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Review Draft Again
              </button>

              <button
                type="button"
                onClick={handleExecuteMassDispatch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/25 transition-all hover:scale-105 active:scale-95"
              >
                <Send size={13} />
                <span>Yes, Launch Email Broadcast ({targetedRecipients.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
