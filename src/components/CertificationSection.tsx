import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Sparkles, Shield, Cpu } from "lucide-react";

export function CertificationSection() {
  return (
    <section
      className="py-20 sm:py-24 bg-emerald-50/30 border-b border-emerald-100/60"
      id="certification"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-emerald-300 text-emerald-800 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
          >
            Dual-Tier IEEE Credentials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Tiered Certification & Silicon Capstone
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Validate your engineering competence with verifiable IEEE credentials ranging from foundational attendance to physical silicon tape-out fabrication distinction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Tier 1: Participation */}
          <Card className="bg-white/90 backdrop-blur-xs border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Shield size={14} className="text-slate-500" />
                  <span>Foundational Tier</span>
                </span>
                <span className="text-xs font-medium text-slate-400">IEEE Accredited</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Certificate of Participation
              </h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Awarded to engineers and students who demonstrate dedication and maintain consistent attendance throughout the masterclass.
              </p>

              <div className="space-y-3.5 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700 text-sm font-medium">
                    ≥ 80% verified live session lecture & lab attendance
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700 text-sm font-medium">
                    Active participation in Q&A, hands-on toolchain setup, and technical discussions
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={18} />
                  <span className="text-slate-700 text-sm font-medium">
                    Official credential signed by IEEE Sensors Council & Section Leadership
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Verification: Digital Certificate ID</span>
                <span className="font-semibold text-slate-700">All Registered Attendees</span>
              </div>
            </CardContent>
          </Card>

          {/* Tier 2: Distinction & Silicon Tape-Out */}
          <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-500 shadow-xl flex flex-col h-full group hover:shadow-2xl transition-all duration-300">
            <Card className="bg-white flex flex-col h-full rounded-[14px] overflow-hidden border-0 relative">
              {/* Badge */}
              <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white text-xs font-black px-4 py-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Award size={14} />
                  <span>Capstone Distinction</span>
                </span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  Flagship
                </span>
              </div>

              <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                  Certificate of Distinction
                </h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  The ultimate credential for engineers who successfully complete and physically verify their RF IC capstone building block.
                </p>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-800 text-sm font-medium">
                      Design, simulate & layout a functional RF circuit (e.g., LNA, Mixer, VCO)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-800 text-sm font-medium">
                      Pass automated DRC/LVS physical sign-off on 130nm Open-Source PDKs
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-800 text-sm font-medium">
                      Submit reproducible GitHub repository with SPICE testbenches & GDSII
                    </span>
                  </div>

                  {/* Tape-Out Accelerator USP Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 shadow-2xs mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu size={16} className="text-amber-700 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                        Physical Tape-Out Opportunity
                      </span>
                    </div>
                    <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                      Series USP: Top validated student designs qualify for fabrication on open MPW shuttle runs (IHP / SkyWater open silicon)!
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-emerald-800 font-bold flex items-center justify-between">
                  <span>Sign-Off: Technical Committee & Industry Leads</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <Sparkles size={12} />
                    <span>Tape-Out Eligible</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
