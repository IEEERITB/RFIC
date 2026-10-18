'use client';

import { Iridescence } from './react-bits/Iridescence';

export function ScrollExpandSection() {
  return (
    <section className="relative w-full mb-16 md:mb-24 overflow-hidden shadow-sm" id="visual-showcase">
      <div className="relative w-full min-h-[60vh] md:min-h-[500px] flex flex-col items-center justify-center text-center p-8">
        <Iridescence className="opacity-100" speed={0.4} />
        
        {/* The tech graphic blended into the iridescence background */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-center bg-cover" 
          style={{ backgroundImage: 'url(/rf-chip-hero.jpg)' }} 
        />
        
        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/60 shadow-xl">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-2 drop-shadow-sm tracking-tight">
            At the Silicon Level
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 drop-shadow-sm">
            Master the Physical Layer
          </h3>
          <p className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Dive deep into industry Open-Source PDKs (OS PDKs). From schematic to physical layout and DRC/LVS verification, successful student chip designs will advance to actual physical Silicon TAPEOUT.
          </p>
        </div>
      </div>
    </section>
  );
}
