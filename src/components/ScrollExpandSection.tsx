"use client";

import { BentoGrid, BentoCard } from "./magicui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Cpu, DollarSign, CheckCircle2, Award, Layers, Zap, ArrowUpRight } from "lucide-react";

export function ScrollExpandSection() {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-slate-200/60 relative overflow-hidden" id="visual-showcase">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="mb-4 border-sky-300 text-sky-700 bg-sky-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
          >
            Physical Silicon Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            From Schematic to Physical Silicon Tape-Out
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Experience the complete semiconductor engineering lifecycle. Move past simulation theory into real-world Open-Source PDKs (OS PDKs) and automated MPW foundry manufacturing shuttles.
          </p>
        </div>

        {/* Magic UI Bento Grid */}
        <BentoGrid className="auto-rows-[19rem] md:auto-rows-[20rem]">
          {/* Card 1: Foundry Open MPW Shuttles */}
          <BentoCard
            name="Foundry Open MPW Shuttles"
            className="md:col-span-2 bg-gradient-to-br from-white via-sky-50/20 to-white"
            Icon={Cpu}
            badge="130nm Silicon"
            description="Fabrication-ready flow targeting SkyWater 130nm CMOS and IHP 130nm BiCMOS open PDKs. Validated student team designs advance directly into physical silicon tape-out shuttles."
            cta="Explore Silicon Specs"
            href="#curriculum"
            background={
              <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-sky-400/10 via-teal-400/5 to-transparent rounded-full blur-2xl" />
            }
          />

          {/* Card 2: Zero License Barrier */}
          <BentoCard
            name="Zero-License FOSS Toolchain"
            className="md:col-span-1 bg-gradient-to-br from-white via-slate-50 to-white"
            Icon={DollarSign}
            badge="$0 vs $150k"
            description="Replace prohibitive enterprise EDA licenses ($150,000/seat/year) with production-grade open-source tools: Xschem, Ngspice, Qucs-S, and KLayout."
            cta="Compare Tools"
            href="#toolchain"
            background={
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-tl from-emerald-400/10 to-transparent rounded-full blur-xl" />
            }
          />

          {/* Card 3: DRC & LVS Sign-off */}
          <BentoCard
            name="Real-Time DRC / LVS Sign-Off"
            className="md:col-span-1 bg-gradient-to-br from-white via-slate-50 to-white"
            Icon={CheckCircle2}
            badge="Physical Verification"
            description="Rigorous geometry Design Rule Checking (DRC) and Layout-Versus-Schematic (LVS) verification using Netgen and KLayout geometry engines."
            cta="View Verification Flow"
            href="#toolchain"
            background={
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-xl" />
            }
          />

          {/* Card 4: IEEE Dual-Tier Credential */}
          <BentoCard
            name="IEEE Dual-Tier Credentials & Tape-Out Track"
            className="md:col-span-2 bg-gradient-to-br from-white via-emerald-50/20 to-white"
            Icon={Award}
            badge="Verifiable Badge"
            description="Earn institutional recognition endorsed by IEEE Sensors Council RIT-B & IEEE openSilicon. Outstanding designs qualify for the Flagship Silicon Capstone Tape-Out Distinction."
            cta="Review Certification Tracks"
            href="#certification"
            background={
              <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-emerald-400/10 via-sky-400/5 to-transparent rounded-full blur-2xl" />
            }
          />
        </BentoGrid>
      </div>
    </section>
  );
}
