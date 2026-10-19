"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stakeholders, Stakeholder } from "@/data/stakeholders";
import { Globe, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.67-.75 1.67-1.67 0-.92-.75-1.67-1.67-1.67-.92 0-1.67.75-1.67 1.67 0 .92.75 1.67 1.67 1.67M5.07 18.5h2.78v-8.37H5.07v8.37z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function StakeholdersSection() {
  const leadership = stakeholders.filter((s) => s.category !== "organiser");
  const organisers = stakeholders.filter((s) => s.category === "organiser");

  return (
    <section className="py-24 bg-transparent relative overflow-hidden transition-colors duration-500" id="stakeholders" data-bgcolor="#ffffff" data-textcolor="#0f172a">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-sky-300 text-sky-700 bg-sky-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            Program Leadership & Team
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Meet the Stakeholders
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
            Guiding the masterclass from theoretical foundations to physical open-source silicon tape-out.
          </p>
        </div>

        {/* Section 1: Advisory & Curation */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-3">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <h3 className="text-xl font-bold text-slate-800">Series Mentorship & Advisory</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {leadership.map((person) => (
              <StakeholderCard key={person.id} person={person} isCompact={true} />
            ))}
          </div>
        </div>

        {/* Section 2: Organizing Committee */}
        <div>
          <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-800">Organising Committee</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organisers.map((person) => (
              <StakeholderCard key={person.id} person={person} isCompact={true} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StakeholderCard({ person, isCompact = true }: { person: Stakeholder; isCompact?: boolean }) {
  const [imgError, setImgError] = useState(false);

  // Initial letters for avatar fallback
  const initials = person.name
    .replace(/^Dr\.\s+/, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const mailtoHref = person.emails ? `mailto:${person.emails.join(",")}` : undefined;

  return (
    <Card className="bg-white border-slate-200/80 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden group">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-50 to-slate-100 border-2 border-slate-200/80 group-hover:border-sky-500 transition-colors shrink-0 shadow-inner">
            {person.avatarUrl && !imgError ? (
              <img
                src={person.avatarUrl}
                alt={person.name}
                className="w-full h-full object-cover object-center"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-sky-700 bg-gradient-to-br from-sky-100 via-sky-50 to-slate-100">
                {initials}
              </div>
            )}
          </div>

          {/* Social Links as Icons Only */}
          <div className="flex items-center gap-1.5 pt-1">
            {person.linkedInUrl && (
              <Link
                href={person.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0A66C2] text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <LinkedinIcon className="w-4 h-4" />
              </Link>
            )}
            {person.githubUrl && (
              <Link
                href={person.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <GithubIcon className="w-4 h-4" />
              </Link>
            )}
            {person.portfolioUrl && (
              <Link
                href={person.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Website / Faculty Profile"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-600 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <Globe size={16} />
              </Link>
            )}
            {mailtoHref && (
              <a
                href={mailtoHref}
                title={person.emails?.join(", ")}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-600 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Person details */}
        <div className="mb-2">
          <Badge variant="secondary" className="bg-sky-50 text-sky-700 border border-sky-100 font-semibold text-xs mb-1.5">
            {person.role}
          </Badge>
          <h4 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
            {person.name}
          </h4>
          <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
            {person.organization}
          </p>
        </div>

        {/* Bio */}
        <p className={`text-slate-600 text-xs md:text-sm leading-relaxed flex-1 ${isCompact ? "line-clamp-5 group-hover:line-clamp-none hover:line-clamp-none transition-all duration-300" : ""}`}>
          {person.bio}
        </p>

        {/* If emails exist, show them clearly as clickable badges */}
        {person.emails && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
            {person.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="text-[11px] text-sky-700 hover:text-sky-800 bg-sky-50/80 hover:bg-sky-100 px-2 py-0.5 rounded border border-sky-200/60 font-mono transition-colors"
                title={`Send email to ${email}`}
              >
                {email}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
