"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/data/modules";
import { speakers } from "@/data/speakers";
import { Calendar, Clock, PenTool } from "lucide-react";
import { AnimatedGroup } from "./react-bits/AnimatedGroup";

export function CurriculumSection() {
  return (
    <section className="py-20 bg-slate-50" id="curriculum">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">8-Module Curriculum Blueprint</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">A comprehensive masterclass designed to take you from foundational high-frequency theory to tape-out ready RF IC designs.</p>
        </div>

        <Accordion className="w-full">
          {modules.map((mod) => (
            <AccordionItem key={mod.moduleNumber} value={`module-${mod.moduleNumber}`} className="border border-slate-200 shadow-sm mb-4 bg-white rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline hover:text-sky-700 text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
                  <span className="text-sky-600 font-mono font-bold whitespace-nowrap">Module {mod.moduleNumber}</span>
                  <span className="font-semibold text-slate-900">{mod.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pt-4 pb-6">
                <AnimatedGroup className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1 rounded-md text-slate-700">
                      <Calendar size={14} className="text-sky-600" />
                      {mod.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1 rounded-md text-slate-700">
                      <Clock size={14} className="text-teal-600" />
                      {mod.time}
                    </div>
                  </div>

                  <div className="space-y-4">
                  <div>
                    <h4 className="text-slate-900 font-medium mb-2">Technical Topics</h4>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      {mod.technicalTopics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  {mod.fossTooling.length > 0 && (
                    <div>
                      <h4 className="text-slate-900 font-medium mb-2 flex items-center gap-2">
                        <PenTool size={16} className="text-sky-600" /> FOSS Lab Tooling
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mod.fossTooling.map((tool, i) => (
                          <Badge key={i} variant="outline" className="border-slate-200 text-slate-700 bg-slate-50">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-slate-900 font-medium mb-2">Instructors</h4>
                    <div className="flex flex-wrap gap-3">
                      {mod.speakerIds.map(id => {
                        const spk = speakers.find(s => s.id === id);
                        return spk ? (
                          <div key={id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1">
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
                            <span className="text-sm text-slate-700 font-medium">{spk.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                </AnimatedGroup>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
