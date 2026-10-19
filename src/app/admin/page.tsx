import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const participants = await prisma.participant.findMany({
    orderBy: { registrationDate: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-8 border-b border-[#1F2937] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage registered candidates for the IEEE RF IC Design Series.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#111827] border border-[#1F2937] px-4 py-2 rounded-lg text-sm">
              Total Registered: <span className="text-emerald-400 font-bold ml-2">{participants.length}</span>
            </div>
            <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              &larr; Back to Site
            </Link>
          </div>
        </header>

        <div className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#1F2937] text-gray-300 border-b border-[#374151]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email & Phone</th>
                  <th className="px-6 py-4 font-semibold">Profiles</th>
                  <th className="px-6 py-4 font-semibold">Institution / Company</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold">IEEE Member</th>
                  <th className="px-6 py-4 font-semibold">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No candidates have registered yet.
                    </td>
                  </tr>
                ) : (
                  participants.map((p: any) => (
                    <tr key={p.id} className="hover:bg-[#1F2937]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{p.fullName}</td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${p.email}`} className="text-cyan-400 hover:underline block">{p.email}</a>
                        {p.phone && <span className="text-xs text-gray-400 font-mono block mt-0.5">{p.phone}</span>}
                      </td>
                      <td className="px-6 py-4 text-xs space-x-2">
                        {p.linkedinUrl && (
                          <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                            LinkedIn
                          </a>
                        )}
                        {p.githubHandle && (
                          <a href={p.githubHandle.startsWith('http') ? p.githubHandle : `https://github.com/${p.githubHandle}`} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:underline">
                            GitHub
                          </a>
                        )}
                        {!p.linkedinUrl && !p.githubHandle && <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-6 py-4">{p.institutionOrCompany}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md text-xs border border-gray-700">
                          {p.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs border ${
                          p.experienceLevel === 'BEGINNER' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' :
                          p.experienceLevel === 'INTERMEDIATE' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' :
                          'bg-purple-900/30 text-purple-400 border-purple-800/50'
                        }`}>
                          {p.experienceLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.ieeeMember ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            ✓ Yes {p.ieeeMembershipId ? `(${p.ieeeMembershipId})` : ''}
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {format(new Date(p.registrationDate), 'MMM d, yyyy HH:mm')}
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
