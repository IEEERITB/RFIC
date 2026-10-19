"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/data/modules";
import { speakers } from "@/data/speakers";
import { Calendar, Clock, Terminal, ChevronRight, CheckCircle, Sparkles } from "lucide-react";

export function CurriculumSection() {
  return (
    <section
      className="py-20 sm:py-24 bg-transparent transition-colors duration-500"
      id="curriculum"
      data-bgcolor="#e0f2fe"
      data-textcolor="#0369a1"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-sky-300 text-sky-700 bg-sky-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
          >
            4-Week Intensive Blueprint
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            8-Module RF IC Curriculum
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            A step-by-step masterclass taking you from RF transceiver architecture theory to tape-out-ready open-source silicon building blocks.
          </p>
        </div>

        <Accordion className="w-full space-y-4">
          {modules.map((mod) => (
            <AccordionItem
              key={mod.moduleNumber}
              value={`module-${mod.moduleNumber}`}
              className="border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 bg-white rounded-2xl px-5 sm:px-6 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-5 text-left group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full pr-2">
                  <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-200 shrink-0 w-fit tracking-wider">
                    MOD 0{mod.moduleNumber}
                  </span>
                  <span className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors text-base sm:text-lg leading-snug">
                    {mod.title}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="text-slate-600 pt-2 pb-6 border-t border-slate-100">
                <div className="space-y-6 pt-3">
                  {/* Schedule Details */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-slate-100/80 border border-slate-200/60 px-3 py-1.5 rounded-xl text-slate-700">
                      <Calendar size={14} className="text-sky-600 shrink-0" />
                      <span>{mod.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-slate-100/80 border border-slate-200/60 px-3 py-1.5 rounded-xl text-slate-700">
                      <Clock size={14} className="text-teal-600 shrink-0" />
                      <span>{mod.time}</span>
                    </div>
                  </div>

                  {/* Technical Topics */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <ChevronRight size={14} className="text-sky-600" />
                      <span>Key Technical Topics</span>
                    </h4>
                    <ul className="space-y-2">
                      {mod.technicalTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* FOSS Tooling */}
                  {mod.fossTooling && mod.fossTooling.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Terminal size={14} className="text-sky-600" />
                        <span>FOSS Lab Toolchain</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mod.fossTooling.map((tool, i) => (
                          <span
                            key={i}
                            className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200/80 shadow-2xs"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructors */}
                  {mod.speakerIds && mod.speakerIds.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-sky-600" />
                        <span>Session Lead / Mentors</span>
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {mod.speakerIds.map((id) => {
                          const spk = speakers.find((s) => s.id === id);
                          if (!spk) return null;
                          return (
                            <div
                              key={id}
                              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full pl-1.5 pr-3 py-1 transition-colors"
                            >
                              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-700 overflow-hidden relative shrink-0">
                                {spk.avatarUrl ? (
                                  <img
                                    src={spk.avatarUrl}
                                    alt={spk.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  spk.name.charAt(0)
                                )}
                              </div>
                              <span className="text-xs sm:text-sm text-slate-800 font-semibold">
                                {spk.name}
                              </span>
                              <span className="text-[11px] text-slate-500 hidden sm:inline">
                                ({spk.organization})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
