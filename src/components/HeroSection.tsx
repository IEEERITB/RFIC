import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Squares } from "./react-bits/Squares";
import { SplitText } from "./react-bits/SplitText";
import { StarBorder } from "./react-bits/StarBorder";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center" id="overview">
      <Squares direction="diagonal" speed={0.5} squareSize={40} borderColor="#e2e8f0" hoverFillColor="#f1f5f9" />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
        <div className="mb-10">
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-95">
            <div className="bg-white p-3 rounded-xl shadow-lg h-24 flex items-center justify-center min-w-[150px] hover:scale-105 transition-transform duration-200">
              <img src="/logos/ieee.svg" alt="IEEE" className="max-h-14 w-auto object-contain" />
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg h-24 flex items-center justify-center min-w-[160px] hover:scale-105 transition-transform duration-200">
              <img src="/logos/ieee-bangalore.png" alt="IEEE Bangalore Section" className="max-h-full w-auto object-contain" />
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg h-24 flex items-center justify-center min-w-[160px] hover:scale-105 transition-transform duration-200">
              <img src="/logos/ieee-sensors-council.png" alt="IEEE Sensors Council" className="max-h-full w-auto object-contain" />
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg h-24 flex items-center justify-center min-w-[170px] max-w-[210px] hover:scale-105 transition-transform duration-200">
              <img src="/logos/ieee-opensilicon.png" alt="IEEE openSilicon" className="max-h-full w-auto object-contain" />
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg h-24 flex items-center justify-center min-w-[150px] hover:scale-105 transition-transform duration-200">
              <img src="/logos/ieee-ramaiah.jpg" alt="IEEE Ramaiah" className="max-h-full w-auto object-contain" />
            </div>
          </div>
        </div>

        <Badge variant="outline" className="mb-6 border-sky-200 text-sky-700 bg-sky-50 px-4 py-1.5 text-sm font-semibold">
          IEEE Flagship Micro-Specialization Track • Physical Tape-Out Opportunity
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          <SplitText text="Master RF IC Design for 5G/6G on Open-Source Silicon" delay={0.1} />
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
          An 8-Module Masterclass bridging high-frequency architectural theory, FOSS EDA pipelines, and open-source MPW shuttle tape-outs with industry-standard <strong>Open-Source PDKs (OS PDKs)</strong>. Successful student chip designs will receive actual <strong>silicon tape-out opportunities</strong>.
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          <Badge variant="secondary" className="bg-sky-100 text-sky-800 px-6 py-2.5 text-sm font-semibold border border-sky-200 cursor-default">
            4 Weeks • 8 Modules
          </Badge>
          <Badge variant="secondary" className="bg-sky-100 text-sky-800 px-6 py-2.5 text-sm font-semibold border border-sky-200 cursor-default">
            Zero-Cost FOSS Toolchain
          </Badge>
          <Badge variant="secondary" className="bg-sky-100 text-sky-800 px-6 py-2.5 text-sm font-semibold border border-sky-200 cursor-default">
            Open-Source PDKs (OS PDKs)
          </Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-900 px-6 py-2.5 text-sm font-semibold border border-amber-300 shadow-sm cursor-default">
            ★ Tape-Out for Student Designs
          </Badge>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-6 py-2.5 text-sm font-semibold border border-emerald-200 cursor-default">
            IEEE Credentialed Certification
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="#register" className="w-full sm:w-auto">
            <StarBorder as="div" className="w-full h-full rounded-full">
              <div className="px-8 py-3 w-full font-semibold text-white rounded-full">
                Register for Free
              </div>
            </StarBorder>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-auto py-3 px-8 bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 text-base font-semibold rounded-full shadow-sm">
            Download Syllabus
          </Button>
        </div>
      </div>
    </section>
  );
}
