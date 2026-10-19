"use client";

import React, { useState } from "react";
import TechText from "./react-bits/TechText";
import { Badge } from "@/components/ui/badge";
import { Cpu, Sparkles, Move, MousePointerClick } from "lucide-react";

const PRESETS = [
  { label: "IEEE RF IC", value: "IEEE RF IC" },
  { label: "OPEN SILICON", value: "OPEN SILICON" },
  { label: "130nm BiCMOS", value: "130nm BiCMOS" },
];

export function TechTextSection() {
  const [selectedWord, setSelectedWord] = useState("IEEE RF IC");

  return (
    <section 
      className="py-16 md:py-24 px-4 relative overflow-hidden transition-colors duration-500"
      id="silicon-workbench"
      data-bgcolor="#060b16"
      data-textcolor="#f8fafc"
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Badge 
            variant="outline" 
            className="mb-4 border-sky-400/30 text-sky-400 bg-sky-950/40 px-3.5 py-1 text-xs uppercase tracking-widest font-semibold backdrop-blur-md inline-flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Interactive Silicon CAD Engine</span>
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Open-Source Silicon Typography
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Drag individual characters off their baseline, click to trigger spring-back shockwaves, or hover to inspect EDA vector paths.
          </p>

          {/* Interactive Wordmark Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Preset:
            </span>
            {PRESETS.map((p) => {
              const active = selectedWord === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setSelectedWord(p.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 border ${
                    active
                      ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/25 scale-105"
                      : "bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-white hover:border-slate-500"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TechText Display Container */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#080F1E] via-[#050A14] to-[#03060C] border border-sky-500/25 shadow-2xl backdrop-blur-2xl">
          {/* Subtle Circuit Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
              backgroundSize: "24px 24px"
            }}
          />

          {/* Tech Spec Corner Badges */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-sky-400 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              VECTOR CAD • LIVE
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-slate-400 backdrop-blur-md">
              GRID: 130nm PDK
            </span>
          </div>

          {/* Interactive TechText Canvas */}
          <div className="w-full h-[320px] sm:h-[400px] md:h-[460px] relative flex items-center justify-center">
            <TechText
              text={selectedWord}
              fontWeight={600}
              fontSize={140}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={16}
              intro="none"
              introDuration={2}
              clickKick
              guides={false}
              fontFamily=""
              letterSpacing={-0.05}
              accentColor="#38bdf8"
              reach={200}
              softness={0.7}
              lineStyle="dashed"
              strokeWidth={1.5}
              speed={1}
              bounce={0.4}
              selection
              labels
              color="#f8fafc"
              align="center"
              draggable
              sweep
            />
          </div>

          {/* Interactive Helper Footer Bar */}
          <div className="border-t border-slate-800/80 bg-slate-950/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sky-300">
                <Move size={13} className="text-sky-400" /> Drag to Displace
              </span>
              <span className="flex items-center gap-1.5 text-teal-300">
                <MousePointerClick size={13} className="text-teal-400" /> Click to Kick
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-amber-300">
                <Sparkles size={13} className="text-amber-400" /> Hover for EDA Outline
              </span>
            </div>
            <div className="text-slate-400 text-xs">
              Physics Spring: <span className="text-white font-semibold">320 Hz</span> • Damping: <span className="text-white font-semibold">0.4</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
