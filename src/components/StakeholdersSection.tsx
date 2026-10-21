"use client";

import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "./react-bits/SpotlightCard";
import {
  advisoryStakeholders,
  resourcePersons,
  organisingCommittee,
  Stakeholder,
} from "@/data/stakeholders";
import { Globe, Mail, Sparkles, Users, BookOpen, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
  const [selectedPerson, setSelectedPerson] = useState<Stakeholder | null>(null);

  return (
    <section
      className="py-20 sm:py-24 bg-white relative overflow-hidden border-b border-slate-200/60"
      id="stakeholders"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-sky-300 text-sky-700 bg-sky-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
          >
            Program Leadership & Team
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Meet the Stakeholders
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Guiding the masterclass from theoretical foundations to physical open-source silicon tape-out.
          </p>
        </div>

        {/* Section 1: Advisory & Mentorship */}
        <div className="mb-14 sm:mb-16">
          <div className="flex items-center gap-2 mb-6 sm:mb-8 border-b border-slate-200 pb-3">
            <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Series Mentorship & Advisory
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {advisoryStakeholders.map((person) => (
              <StakeholderCard
                key={`advisory-${person.id}`}
                person={person}
                onSelect={() => setSelectedPerson(person)}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Resource Persons of the Series */}
        <div className="mb-14 sm:mb-16" id="resource-persons">
          <div className="flex items-center gap-2 mb-6 sm:mb-8 border-b border-slate-200 pb-3">
            <BookOpen className="w-5 h-5 text-sky-600 shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Resource Persons of the Series
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {resourcePersons.map((person) => (
              <StakeholderCard
                key={`resource-${person.id}`}
                person={person}
                onSelect={() => setSelectedPerson(person)}
              />
            ))}
          </div>
        </div>

        {/* Section 3: Organizing Committee */}
        <div>
          <div className="flex items-center gap-2 mb-6 sm:mb-8 border-b border-slate-200 pb-3">
            <Users className="w-5 h-5 text-sky-600 shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Organising Committee
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {organisingCommittee.map((person) => (
              <StakeholderCard
                key={`organiser-${person.id}`}
                person={person}
                onSelect={() => setSelectedPerson(person)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stakeholder Details Modal */}
      {selectedPerson && (
        <StakeholderModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}
    </section>
  );
}

function StakeholderCard({
  person,
  onSelect,
}: {
  person: Stakeholder;
  onSelect: () => void;
}) {
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
    <SpotlightCard
      spotlightColor="rgba(2, 132, 199, 0.12)"
      className="bg-white/95 backdrop-blur-xs border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden group cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-50 to-slate-100 border-2 border-slate-200/80 group-hover:border-sky-500 transition-colors shrink-0 shadow-inner">
            {person.avatarUrl && !imgError ? (
              <img
                src={person.avatarUrl}
                alt={person.name}
                className="w-full h-full object-cover object-center"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-lg sm:text-xl text-sky-700 bg-gradient-to-br from-sky-100 via-sky-50 to-slate-100">
                {initials}
              </div>
            )}
          </div>

          {/* Social Links as Icons Only */}
          <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
            {person.linkedInUrl && (
              <Link
                href={person.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`${person.name}'s LinkedIn Profile`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0A66C2] text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <LinkedinIcon className="w-4 h-4" />
              </Link>
            )}
            {person.githubUrl && (
              <Link
                href={person.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`${person.name}'s GitHub Profile`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <GithubIcon className="w-4 h-4" />
              </Link>
            )}
            {person.portfolioUrl && (
              <Link
                href={person.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`${person.name}'s Faculty Profile / Website`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-600 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Globe size={16} />
              </Link>
            )}
            {mailtoHref && (
              <a
                href={mailtoHref}
                title={`Send email to ${person.name}`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-600 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Person details */}
        <div className="mb-2">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {person.role.includes("•") ? (
              person.role.split("•").map((part, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-tight ${
                    idx === 0
                      ? "bg-sky-50 text-sky-700 border border-sky-200/80"
                      : "bg-teal-50 text-teal-700 border border-teal-200/80"
                  }`}
                >
                  {part.trim()}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
                {person.role}
              </span>
            )}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
            {person.name}
          </h4>
          <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
            {person.organization}
          </p>
        </div>

        {/* Bio */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-4">
          {person.bio}
        </p>

        {person.bio.length > 150 && (
          <div className="pt-2">
            <span className="text-[11px] font-bold text-sky-600 group-hover:text-sky-700 inline-flex items-center gap-1">
              Read Full Bio →
            </span>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

function StakeholderModal({
  person,
  onClose,
}: {
  person: Stakeholder;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const initials = person.name
    .replace(/^Dr\.\s+/, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const mailtoHref = person.emails ? `mailto:${person.emails.join(",")}` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-sky-50/50 via-white to-white">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-sky-200 shrink-0 shadow-sm">
              {person.avatarUrl && !imgError ? (
                <img
                  src={person.avatarUrl}
                  alt={person.name}
                  className="w-full h-full object-cover object-center"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-sky-700 bg-sky-100">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {person.role.includes("•") ? (
                  person.role.split("•").map((part, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${
                        idx === 0
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : "bg-teal-50 text-teal-700 border border-teal-200"
                      }`}
                    >
                      {part.trim()}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    {person.role}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {person.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {person.organization}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Full Bio */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 max-h-[60vh]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Biography & Background
          </h4>
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3 font-normal">
            {person.bio}
          </div>
        </div>

        {/* Modal Footer: Links & Close */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {person.linkedInUrl && (
              <a
                href={person.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 transition-colors shadow-2xs"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
            {person.githubUrl && (
              <a
                href={person.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-2xs"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {person.portfolioUrl && (
              <a
                href={person.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-500/40 transition-colors shadow-2xs"
              >
                <Globe size={13} />
                <span>Website</span>
              </a>
            )}
            {mailtoHref && (
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-500/40 transition-colors shadow-2xs"
              >
                <Mail size={13} />
                <span>Email</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
