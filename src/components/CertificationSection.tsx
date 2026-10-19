import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function CertificationSection() {
  return (
    <section className="py-20 bg-transparent transition-colors duration-500" id="certification" data-bgcolor="#ecfdf5" data-textcolor="#047857">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Tiered Certification & Capstone</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Validate your skills with official IEEE credentials ranging from participation to verifiable technical distinction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white border-slate-200 shadow-sm flex flex-col h-full">
            <CardContent className="p-8 flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Certificate of Participation</h3>
              <p className="text-slate-600 mb-6 min-h-[3rem]">Awarded to attendees who maintain consistent attendance and engagement.</p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700 text-sm">Requires ≥ 80% verified session attendance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700 text-sm">Active participation in Q&A and community discussions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-sky-300 shadow-md flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Micro-Specialization
            </div>
            <CardContent className="p-8 flex-1">
              <h3 className="text-2xl font-bold text-sky-700 mb-2">Certificate of Distinction</h3>
              <p className="text-slate-600 mb-6 min-h-[3rem]">The ultimate credential for engineers who successfully complete the hands-on capstone project.</p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700 text-sm">Design and layout a functional RF building block (e.g., LNA)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700 text-sm">Pass automated DRC/LVS checks on leading Open-Source PDKs (OS PDKs)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-sky-600 shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700 text-sm">Submit via public GitHub repository with reproducible testbenches</span>
                </li>
                <li className="flex items-start gap-3 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                  <CheckCircle2 className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <span className="text-amber-900 text-sm font-semibold">
                    Series USP: Top validated designs qualify for physical silicon TAPEOUT shuttle fabrication!
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
