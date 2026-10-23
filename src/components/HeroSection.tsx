"use client";

import Link from "next/link";
import { GridPattern } from "./magicui/grid-pattern";
import { NumberTicker } from "./magicui/number-ticker";
import { ShimmerButton } from "./magicui/shimmer-button";
import { Cpu, Calendar, ShieldCheck, Sparkles, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { SwarmCursor } from "./SwarmCursor";

export function HeroSection() {
  const partners = [
    {
      name: "IEEE - Advancing Technology for Humanity",
      logo: "/logos/ieee.svg",
      imageClass: "max-h-9 sm:max-h-11 md:max-h-12 max-w-[85%] w-auto",
    },
    {
      name: "IEEE Bangalore Section",
      logo: "/logos/ieee-bangalore.png",
      imageClass: "max-h-9 sm:max-h-11 md:max-h-11 max-w-[88%] w-auto",
    },
    {
      name: "IEEE Sensors Council",
      logo: "/logos/ieee-sensors-council.png",
      imageClass: "max-h-8 sm:max-h-10 md:max-h-11 max-w-[90%] w-auto",
    },
    {
      name: "IEEE openSilicon",
      logo: "/logos/ieee-opensilicon.png",
      imageClass: "max-h-9 sm:max-h-10 md:max-h-11 max-w-[88%] w-auto",
    },
  ];

  return (
    <section
      className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden min-h-[92vh] flex flex-col justify-center bg-white"
      id="overview"
    >
      {/* Interactive RF Silicon Carrier Swarm Cursor Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <SwarmCursor
          count={350}
          size={2.4}
          spread={90}
          swirl={0.6}
          speed={0.85}
          clickEffect="burst"
          color="#0284c7"
          accentColor="#38bdf8"
          lightMode={true}
          targets="a, button, [data-swarm-target]"
          hideCursor={false}
          className="w-full h-full"
        />
      </div>

      {/* Magic UI Architectural Grid Pattern */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray="2 4"
        squares={[
          [3, 3],
          [6, 2],
          [8, 5],
          [4, 7],
          [10, 3],
          [12, 6],
          [15, 4],
        ]}
        className="opacity-75"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-5xl">
        {/* Institutional Partner Showcase (Balanced, Prominent & High-Contrast) */}
        <div className="mb-10 sm:mb-12 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-slate-50/70 backdrop-blur-xs p-4 sm:p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-slate-200/80">
              <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Joint Flagship Initiative • Academic & Industry Patrons
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                IEEE Bangalore Section
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-3 sm:gap-4 py-1">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="w-full h-18 sm:h-20 md:h-22 px-3 py-2.5 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all duration-200 overflow-hidden group"
                  title={partner.name}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`${partner.imageClass} object-contain max-h-full max-w-full transition-transform duration-200 group-hover:scale-105 shrink-0`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 mb-6 border border-sky-300/80 text-sky-800 bg-sky-50/90 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Physical Silicon Tape-Out Track • Candidate Registration Live</span>
        </div>

        {/* Main Headline with high-impact typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.12]">
          Master RF IC Design for 5G/6G on{" "}
          <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 bg-clip-text text-transparent">
            Open-Source Silicon
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto font-normal">
          An intensive 8-Module Masterclass bridging high-frequency architectural theory, zero-cost FOSS EDA pipelines, and open-source MPW shuttle tape-outs with industry-standard <strong>Open-Source PDKs (OS PDKs)</strong>. Top validated designs qualify for physical silicon tape-out fabrication!
        </p>

        {/* Magic UI NumberTicker Metric Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-sky-300 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-0.5">
              <NumberTicker value={8} />
              <span className="text-sky-600 text-lg sm:text-xl font-bold">Mod</span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Intensive Modules
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-teal-300 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-0.5">
              <NumberTicker value={100} />
              <span className="text-teal-600 text-lg sm:text-xl font-bold">%</span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              FOSS EDA Toolchain
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-indigo-300 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-0.5">
              <NumberTicker value={130} />
              <span className="text-indigo-600 text-lg sm:text-xl font-bold">nm</span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Foundry Silicon PDKs
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-0.5">
              <span className="text-emerald-600 text-lg sm:text-xl font-bold">$</span>
              <NumberTicker value={0} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              License Barriers
            </div>
          </div>
        </div>

        {/* Action CTAs using Magic UI ShimmerButton */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="#register" className="w-full sm:w-auto inline-block">
            <ShimmerButton
              shimmerColor="#38bdf8"
              background="#0284c7"
              borderRadius="16px"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg shadow-sky-600/20"
            >
              <span>Register for Masterclass</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </ShimmerButton>
          </Link>

          <Link
            href="#curriculum"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-7 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-sky-700 text-base font-semibold rounded-2xl shadow-xs transition-all hover:border-sky-300 active:scale-95"
          >
            <BookOpen size={18} className="text-sky-600" />
            <span>Explore 8-Module Curriculum</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
