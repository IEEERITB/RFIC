"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewView } from "@/components/admin/OverviewView";
import { RegistrationsView } from "@/components/admin/RegistrationsView";
import { EmailCenterView } from "@/components/admin/EmailCenterView";
import { AnalyticsView } from "@/components/admin/AnalyticsView";
import { AuditLogView } from "@/components/admin/AuditLogView";
import { CandidateModal, Participant } from "@/components/admin/CandidateModal";
import { EmailPreviewModal } from "@/components/admin/EmailPreviewModal";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { toast } = useToast();

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [experienceLevel, setExperienceLevel] = useState("ALL");
  const [ieeeMember, setIeeeMember] = useState("ALL");
  const [emailStatus, setEmailStatus] = useState("ALL");

  // Loading States
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals State
  const [activeCandidate, setActiveCandidate] = useState<Participant | null>(null);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<Participant[]>([]);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Fetch Participants with Active Filters
  const fetchParticipants = useCallback(async () => {
    setIsLoadingParticipants(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: search.trim(),
        category,
        experienceLevel,
        ieeeMember,
        emailStatus,
      });

      const res = await fetch(`/api/admin/participants?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.data || []);
        setTotalParticipants(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error("Failed to load participants:", err);
    } finally {
      setIsLoadingParticipants(false);
    }
  }, [page, pageSize, search, category, experienceLevel, ieeeMember, emailStatus]);

  // Initial Load & Updates
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Refresh All Data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStats(), fetchParticipants()]);
    setIsRefreshing(false);
    toast({
      title: "Ledger Synchronized",
      description: "Fetched latest records directly from PostgreSQL database.",
      className: "bg-slate-900 text-white border-slate-800",
    });
  };

  // CSV Export Action
  const handleExportCsv = async () => {
    try {
      const query = new URLSearchParams({
        category,
        experienceLevel,
        ieeeMember,
        emailStatus,
      });
      window.location.href = `/api/admin/export?${query.toString()}`;
      toast({
        title: "Export Initiated",
        description: "Downloading filtered registration ledger as CSV.",
        className: "bg-emerald-600 text-white border-none",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Could not generate CSV file.",
        variant: "destructive",
      });
    }
  };

  // Modal Handlers
  const handleOpenCandidateModal = (candidate: Participant) => {
    setActiveCandidate(candidate);
    setCandidateModalOpen(true);
  };

  const handleOpenEmailModal = (candidates: Participant[]) => {
    if (candidates.length === 0) return;
    setEmailRecipients(candidates);
    setEmailModalOpen(true);
  };

  // Email Dispatch Execution
  const handleSendEmail = async (params: {
    subject: string;
    customMessage?: string;
    templateType?: "CONFIRMATION" | "CUSTOM_BROADCAST";
    headline?: string;
    badgeText?: string;
    bodyContent?: string;
    ctaText?: string;
    ctaUrl?: string;
    additionalNote?: string;
  }) => {
    try {
      const isBulk = emailRecipients.length > 1;
      const payload = isBulk
        ? {
            participantIds: emailRecipients.map((c) => c.id),
            ...params,
          }
        : {
            participantId: emailRecipients[0].id,
            ...params,
          };

      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to dispatch email");
      }

      toast({
        title: isBulk ? "Bulk Dispatch Finished" : "Confirmation Email Dispatched!",
        description: isBulk
          ? `Processed ${result.summary?.sent} sent out of ${result.summary?.total}.`
          : `Sent to ${emailRecipients[0].email} via SMTP.`,
        className: "bg-emerald-600 text-white border-none",
      });

      // Refresh data to reflect updated emailStatus
      fetchParticipants();
      fetchStats();
    } catch (err: any) {
      toast({
        title: "Email Dispatch Error",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update Status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/participants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Status Updated",
          description: `Participant marked as ${status}.`,
          className: "bg-slate-900 text-white border-slate-800",
        });
        fetchParticipants();
        fetchStats();
      }
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/participants?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Record Deleted",
          description: `Removed ${name} from registry.`,
          className: "bg-slate-900 text-white border-slate-800",
        });
        fetchParticipants();
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-sky-500 selection:text-white">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        totalParticipants={totalParticipants}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onExportCsv={handleExportCsv}
        />

        {/* Tab View Render */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === "overview" && (
            <OverviewView
              stats={stats}
              participants={participants}
              onSelectCandidate={handleOpenCandidateModal}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "registrations" && (
            <RegistrationsView
              participants={participants}
              total={totalParticipants}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              search={search}
              category={category}
              experienceLevel={experienceLevel}
              ieeeMember={ieeeMember}
              emailStatus={emailStatus}
              isLoading={isLoadingParticipants}
              onSearchChange={setSearch}
              onFilterChange={(newFilters) => {
                if (newFilters.category !== undefined) setCategory(newFilters.category);
                if (newFilters.experienceLevel !== undefined) setExperienceLevel(newFilters.experienceLevel);
                if (newFilters.ieeeMember !== undefined) setIeeeMember(newFilters.ieeeMember);
                if (newFilters.emailStatus !== undefined) setEmailStatus(newFilters.emailStatus);
                if (newFilters.page !== undefined) setPage(newFilters.page);
                if (newFilters.pageSize !== undefined) setPageSize(newFilters.pageSize);
              }}
              onRefresh={fetchParticipants}
              onExportCsv={handleExportCsv}
              onSelectCandidate={handleOpenCandidateModal}
              onOpenSendEmail={handleOpenEmailModal}
              onDeleteCandidate={handleDeleteCandidate}
            />
          )}

          {activeTab === "email" && (
            <EmailCenterView
              participants={participants}
              onOpenSendEmail={handleOpenEmailModal}
            />
          )}

          {activeTab === "analytics" && <AnalyticsView stats={stats} />}

          {activeTab === "settings" && <AuditLogView />}
        </main>
      </div>

      {/* Candidate Profile Dossier Modal */}
      <CandidateModal
        candidate={activeCandidate}
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        onSendEmail={(candidate) => handleOpenEmailModal([candidate])}
        onDelete={handleDeleteCandidate}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Email Preview & Customization Modal */}
      <EmailPreviewModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        recipients={emailRecipients}
        onConfirmSend={handleSendEmail}
      />
    </div>
  );
}
