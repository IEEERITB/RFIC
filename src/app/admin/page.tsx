import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Users, ShieldCheck, GraduationCap, Briefcase, ArrowLeft, Download, Mail, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const participants = await prisma.participant.findMany({
    orderBy: { registrationDate: "desc" },
  });

  const totalCount = participants.length;
  const ieeeMemberCount = participants.filter((p) => p.ieeeMember).length;
  const studentCount = participants.filter(
    (p) => p.category?.toLowerCase().includes("student")
  ).length;
  const proCount = participants.filter(
    (p) =>
      p.category?.toLowerCase().includes("industry") ||
      p.category?.toLowerCase().includes("faculty") ||
      p.category?.toLowerCase().includes("research")
  ).length;

  const ieeePercentage = totalCount > 0 ? Math.round((ieeeMemberCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans selection:bg-sky-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors bg-sky-950/60 border border-sky-800/80 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft size={14} />
                <span>Return to Live Portal</span>
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Database Sync</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-2">
              IEEE RF IC Masterclass Administration
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Live registration registry, IEEE membership verification, and candidate profile management.
            </p>
          </div>
        </header>

        {/* Executive KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <Users size={22} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered</div>
              <div className="text-2xl font-black text-white">{totalCount}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">IEEE Members</div>
              <div className="text-2xl font-black text-emerald-400">
                {ieeeMemberCount} <span className="text-xs font-normal text-slate-400">({ieeePercentage}%)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Students</div>
              <div className="text-2xl font-black text-indigo-400">{studentCount}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Briefcase size={22} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry & Faculty</div>
              <div className="text-2xl font-black text-amber-400">{proCount}</div>
            </div>
          </div>
        </div>

        {/* Candidate Registry Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Registered Candidate Ledger ({participants.length})
            </h2>
            <span className="text-xs text-slate-500">
              PostgreSQL / Neon DB Production Store
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Candidate Name</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Profiles</th>
                  <th className="px-6 py-3.5">Institution / Org</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Experience</th>
                  <th className="px-6 py-3.5">IEEE Status</th>
                  <th className="px-6 py-3.5">Registration Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                      No candidates have registered yet. Records will populate in real time.
                    </td>
                  </tr>
                ) : (
                  participants.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{p.fullName}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${p.email}`}
                          className="text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
                        >
                          <Mail size={12} />
                          <span>{p.email}</span>
                        </a>
                        {p.phone && (
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {p.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-2">
                          {p.linkedinUrl ? (
                            <a
                              href={p.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-400 hover:underline flex items-center gap-1"
                            >
                              <span>LinkedIn</span>
                              <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                          {p.githubHandle && (
                            <a
                              href={
                                p.githubHandle.startsWith("http")
                                  ? p.githubHandle
                                  : `https://github.com/${p.githubHandle}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              <span>GH</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{p.institutionOrCompany}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
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
                      <td className="px-6 py-4">
                        {p.ieeeMember ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck size={14} />
                            <span>Yes {p.ieeeMembershipId ? `(#${p.ieeeMembershipId})` : ""}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {format(new Date(p.registrationDate), "MMM d, yyyy HH:mm")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
