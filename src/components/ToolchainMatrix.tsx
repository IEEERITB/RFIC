import { CardContent, CardHeader } from "@/components/ui/card";
import { SpotlightCard } from "./react-bits/SpotlightCard";

export function ToolchainMatrix() {
  const tools = [
    { prop: "Cadence Virtuoso Schematic Editor", foss: "Xschem / Qucs-S", role: "Transistor-level schematic capture and port mapping" },
    { prop: "Spectre RF / Keysight ADS", foss: "Ngspice / Xyce", role: "High-frequency SPICE engine simulations (AC, DC, Transient, Multi-tone)" },
    { prop: "Keysight Data Display / MATLAB", foss: "Python (scikit-rf + matplotlib)", role: "S-parameter extraction, Touchstone parsing, Smith Chart plots" },
    { prop: "Ansys HFSS / Keysight Momentum", foss: "openEMS", role: "3D Electromagnetic solver for on-chip passives and microstrips" },
    { prop: "Cadence Virtuoso Layout Suite", foss: "KLayout / Magic VLSI", role: "Physical mask generation, GDSII drawing, active device placement" },
    { prop: "Siemens Calibre (DRC/LVS)", foss: "Netgen / KLayout Geometry DRC", role: "Physical verification, rule checking, and Layout-Versus-Schematic" },
  ];

  return (
    <section className="py-20 bg-transparent transition-colors duration-500" id="toolchain" data-bgcolor="#f1f5f9" data-textcolor="#0f172a">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Proprietary vs. Open-Source Toolchain</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Transitioning from expensive proprietary licenses to production-grade FOSS EDA pipelines for high-frequency RF design.</p>
        </div>

        <SpotlightCard className="overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-slate-100/80 px-6 md:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold text-slate-700">
              <div className="hidden md:block">Proprietary Standard</div>
              <div className="hidden md:block text-sky-700">FOSS Alternative</div>
              <div className="hidden md:block">Technical Role</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {tools.map((tool, i) => (
              <div key={i} className={`grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6 md:px-8 md:py-6 border-b border-slate-200 items-center hover:bg-slate-50 transition-colors ${i === tools.length - 1 ? 'border-0' : ''}`}>
                <div className="text-slate-600 text-sm mb-2 md:mb-0"><span className="md:hidden font-semibold text-slate-700 block mb-1">Proprietary:</span>{tool.prop}</div>
                <div className="mb-2 md:mb-0">
                  <span className="md:hidden font-semibold text-sky-700 block mb-1">FOSS Alternative:</span>
                  <div className="text-sky-700 font-mono text-sm bg-sky-100 px-6 py-3 rounded-full inline-block w-fit">{tool.foss}</div>
                </div>
                <div className="text-slate-700 text-sm md:pr-4"><span className="md:hidden font-semibold text-slate-700 block mb-1">Role:</span>{tool.role}</div>
              </div>
            ))}
          </CardContent>
        </SpotlightCard>
      </div>
    </section>
  );
}
