import { SpotlightCard } from "./react-bits/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { Layers, Activity, LineChart, Radio, Grid3X3, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export function ToolchainMatrix() {
  const tools = [
    {
      category: "Schematic Entry",
      prop: "Cadence Virtuoso Schematic Editor",
      foss: "Xschem / Qucs-S",
      role: "Transistor-level RF schematic capture, port setup & hierarchical symbol generation",
      icon: Layers,
    },
    {
      category: "SPICE Simulation",
      prop: "Spectre RF / Keysight ADS",
      foss: "Ngspice / Xyce",
      role: "High-frequency SPICE engine simulations (AC, DC, Transient, Periodic Steady-State / PSS)",
      icon: Activity,
    },
    {
      category: "RF Data Analytics",
      prop: "Keysight Data Display / MATLAB",
      foss: "Python (scikit-rf + matplotlib)",
      role: "S-parameter Touchstone (.s2p) parsing, Stability circles, and Smith Chart impedance plots",
      icon: LineChart,
    },
    {
      category: "3D EM Modeling",
      prop: "Ansys HFSS / Keysight Momentum",
      foss: "openEMS (FDTD)",
      role: "3D Electromagnetic field solver for on-chip planar inductors, transformers & microstrips",
      icon: Radio,
    },
    {
      category: "Silicon Layout",
      prop: "Cadence Virtuoso Layout Suite",
      foss: "KLayout / Magic VLSI",
      role: "Physical mask drawing, GDSII/OASIS generation, active device placement & guard rings",
      icon: Grid3X3,
    },
    {
      category: "Physical Sign-off",
      prop: "Siemens Calibre (DRC/LVS)",
      foss: "Netgen + KLayout Geometry DRC",
      role: "Full-chip Design Rule Checking (DRC) and Layout-Versus-Schematic (LVS) verification",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      className="py-20 sm:py-24 bg-transparent transition-colors duration-500"
      id="toolchain"
      data-bgcolor="#f1f5f9"
      data-textcolor="#0f172a"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-sky-300 text-sky-700 bg-sky-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
          >
            Zero License Barriers
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Proprietary vs. Open-Source Toolchain
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Transitioning from prohibitive commercial enterprise licenses to production-grade FOSS EDA pipelines capable of tape-out on silicon foundries.
          </p>

          {/* Value Proposition Callout */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-sky-50/80 border border-sky-200/80 rounded-2xl px-5 py-2.5 text-xs sm:text-sm text-sky-950 font-medium shadow-2xs">
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <ShieldAlert size={16} />
              <span>Commercial Equivalent: ~$150,000 / seat / yr</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Sparkles size={16} />
              <span>Series FOSS Toolchain: $0 (Completely Free & Reproducible)</span>
            </span>
          </div>
        </div>

        <SpotlightCard className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-md bg-white">
          {/* Header Row */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 lg:px-8 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
            <div className="col-span-3">Domain / Proprietary Standard</div>
            <div className="col-span-4 text-sky-700 font-bold">Open-Source FOSS Alternative</div>
            <div className="col-span-5">Technical Function in Tape-Out Pipeline</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {tools.map((tool, i) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-5 sm:p-6 lg:px-8 items-center hover:bg-sky-50/40 transition-colors"
                >
                  {/* Proprietary */}
                  <div className="col-span-3 space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <IconComponent size={14} className="text-slate-400" />
                      <span>{tool.category}</span>
                    </span>
                    <div className="text-slate-700 font-semibold text-sm">
                      {tool.prop}
                    </div>
                  </div>

                  {/* FOSS Alternative */}
                  <div className="col-span-4">
                    <span className="md:hidden text-xs font-bold text-sky-700 block mb-1">
                      FOSS Alternative:
                    </span>
                    <span className="inline-flex items-center font-mono font-bold text-xs sm:text-sm text-sky-800 bg-sky-100/80 border border-sky-300/80 px-3.5 py-1.5 rounded-xl shadow-2xs">
                      {tool.foss}
                    </span>
                  </div>

                  {/* Technical Role */}
                  <div className="col-span-5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    <span className="md:hidden text-xs font-bold text-slate-700 block mb-1">
                      Role in Design Flow:
                    </span>
                    {tool.role}
                  </div>
                </div>
              );
            })}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
