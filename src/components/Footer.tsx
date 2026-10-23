import Link from "next/link";
import { ArrowUp, Sparkles, Shield, Cpu, ExternalLink } from "lucide-react";
import { WHATSAPP_GROUP_URL } from "./RegistrationForm";

export function Footer() {
  return (
    <footer
      className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16 relative"
      id="footer"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Initiative Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logos/ieee-opensilicon.png"
                alt="IEEE openSilicon"
                className="h-9 w-auto object-contain bg-white/95 p-1 rounded-lg"
              />
              <span className="text-white font-extrabold text-lg tracking-tight">
                IEEE RF IC Series
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              An 8-Module Masterclass empowering the next generation of semiconductor designers to bridge architectural theory with open-source silicon tape-out pipelines.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 text-sky-400 border border-slate-700 px-2.5 py-1 rounded-lg font-mono">
                <Cpu size={12} />
                <span>IHP 130nm BiCMOS</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 text-teal-400 border border-slate-700 px-2.5 py-1 rounded-lg font-mono">
                <Sparkles size={12} />
                <span>SkyWater 130nm</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 text-amber-400 border border-slate-700 px-2.5 py-1 rounded-lg font-mono">
                <Shield size={12} />
                <span>Open MPW Shuttle</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#overview" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="#toolchain" className="hover:text-white transition-colors">
                  FOSS Toolchain Matrix
                </Link>
              </li>
              <li>
                <Link href="#curriculum" className="hover:text-white transition-colors">
                  8-Module Curriculum
                </Link>
              </li>
              <li>
                <Link href="#stakeholders" className="hover:text-white transition-colors">
                  Faculty & Mentors
                </Link>
              </li>
              <li>
                <Link href="#certification" className="hover:text-white transition-colors">
                  Dual-Tier Certification
                </Link>
              </li>
              <li>
                <Link href="#schedule" className="hover:text-white transition-colors">
                  Program Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Official Channels
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>WhatsApp Community</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <Link href="#register" className="text-sky-400 hover:text-sky-300 transition-colors">
                  Participant Registration
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="#overview"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg"
              >
                <ArrowUp size={12} />
                <span>Back to Top</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Affiliations */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} IEEE Sensors Council RIT-B & IEEE Bangalore Section. Jointly organized for the Open Silicon Initiative.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
            <span>IEEE Bangalore Section</span>
            <span>•</span>
            <span>IEEE Sensors Council</span>
            <span>•</span>
            <span>IEEE openSilicon</span>
            <span>•</span>
            <span>MSRIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
