"use client";

import { Card, CardContent } from "@/components/ui/card";
import { speakers } from "@/data/speakers";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { ShinyText } from "./react-bits/ShinyText";

export function SpeakersSection() {
  return (
    <section className="py-20 bg-slate-50" id="speakers">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Mentors & Industry Experts</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Learn directly from leading experts in FOSS EDA, silicon physics, and high-frequency RF IC design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((spk) => (
            <Card key={spk.id} className="bg-white border-slate-200 shadow-sm hover:border-sky-300 hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-sky-400 transition-colors flex items-center justify-center text-xl font-bold text-sky-700 overflow-hidden relative shrink-0">
                    {spk.avatarUrl ? (
                      <img
                        src={spk.avatarUrl}
                        alt={spk.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      spk.name.charAt(0)
                    )}
                  </div>
                  {spk.linkedInUrl && (
                    <Link href={spk.linkedInUrl} target="_blank" className="text-slate-400 hover:text-sky-600 transition-colors">
                      <LinkIcon size={20} />
                    </Link>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{spk.name}</h3>
                <ShinyText text={spk.roleTitle} className="text-sm font-medium mb-1" />
                <p className="text-slate-600 text-sm mb-4">{spk.organization}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{spk.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
