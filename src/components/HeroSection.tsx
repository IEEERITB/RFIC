import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Squares } from "./react-bits/Squares";
import { SplitText } from "./react-bits/SplitText";
import { StarBorder } from "./react-bits/StarBorder";
import { Cpu, Calendar, ShieldCheck, Sparkles, BookOpen, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden min-h-[92vh] flex flex-col justify-center bg-white"
      id="overview"
    >
      <Squares
        direction="diagonal"
        speed={0.4}
        squareSize={44}
        borderColor="#e2e8f0"
        hoverFillColor="#f1f5f9"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-5xl">
        {/* Institutional Partner Banner */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Joint Flagship Initiative
            </span>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              <div className="h-10 sm:h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100">
                <img src="/logos/ieee.svg" alt="IEEE" className="max-h-8 sm:max-h-9 w-auto object-contain" />
              </div>
              <div className="h-8 sm:h-10 w-[1px] bg-slate-200 hidden sm:block" />
              <div className="h-10 sm:h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100">
                <img src="/logos/ieee-bangalore.png" alt="IEEE Bangalore Section" className="max-h-8 sm:max-h-10 w-auto object-contain" />
              </div>
              <div className="h-8 sm:h-10 w-[1px] bg-slate-200 hidden sm:block" />
              <div className="h-10 sm:h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100">
                <img src="/logos/ieee-sensors-council.png" alt="IEEE Sensors Council" className="max-h-9 sm:max-h-11 w-auto object-contain" />
              </div>
              <div className="h-8 sm:h-10 w-[1px] bg-slate-200 hidden sm:block" />
              <div className="h-10 sm:h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-85 hover:opacity-100">
                <img src="/logos/ieee-opensilicon.png" alt="IEEE openSilicon" className="max-h-8 sm:max-h-10 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 mb-6 border border-sky-300/80 text-sky-800 bg-sky-50/90 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Physical Silicon Tape-Out Track • Registration Open</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
          <SplitText text="Master RF IC Design for 5G/6G on Open-Source Silicon" delay={0.08} />
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto font-normal">
          An intensive 8-Module Masterclass bridging high-frequency architectural theory, zero-cost FOSS EDA pipelines, and open-source MPW shuttle tape-outs with industry-standard <strong>Open-Source PDKs (OS PDKs)</strong>. Top validated designs qualify for physical silicon tape-out fabrication!
        </p>

        {/* Technical Highlights Bar */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 mb-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs">
            <Calendar size={14} className="text-sky-600 shrink-0" />
            <span>4 Weekends • 8 Modules</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs">
            <Cpu size={14} className="text-teal-600 shrink-0" />
            <span>Zero-Cost FOSS EDA Tools</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs">
            <Sparkles size={14} className="text-indigo-600 shrink-0" />
            <span>IHP & SkyWater 130nm PDKs</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xs">
            <span className="text-amber-500">★</span>
            <span>Tape-Out for Top Student Designs</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300/80 text-emerald-900 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>IEEE Dual-Tier Certification</span>
          </span>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="#register" className="w-full sm:w-auto inline-block">
            <StarBorder
              as="div"
              color="#ffffff"
              trailColor="#38bdf8"
              duration={3.5}
              direction="clockwise"
              stars={1}
              trailLength={0.35}
              thickness={1.5}
              radius={14}
              glow={0.7}
              hover="lap"
              sparkle={false}
              clickPulse
              theme="dark"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg shadow-sky-950/10 cursor-pointer"
            >
              Register for Free
            </StarBorder>
          </Link>

          <Link
            href="#curriculum"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-7 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-sky-700 text-base font-semibold rounded-2xl shadow-xs transition-all hover:border-sky-300 active:scale-95"
          >
            <BookOpen size={18} className="text-sky-600" />
            <span>View 8-Module Curriculum</span>
            <ArrowRight size={16} className="text-slate-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
