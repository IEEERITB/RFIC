export function Footer() {
  return (
    <footer className="bg-transparent border-t border-slate-200/50 py-12 mt-12 transition-colors duration-500" data-bgcolor="#0f172a" data-textcolor="#94a3b8">
      <div className="container mx-auto px-4 text-center text-slate-500 text-sm flex flex-col gap-4">
        <div className="flex flex-wrap justify-center gap-6 opacity-75 font-semibold text-slate-700">
          <span>IEEE</span>
          <span>IEEE Bangalore Section</span>
          <span>IEEE Sensors Council</span>
          <span>IEEE openSilicon</span>
          <span>IEEE Ramaiah (MSRIT)</span>
        </div>
        <p>© {new Date().getFullYear()} IEEE Sensors Council (RIT-B Chapter & IEEE Bangalore Section). All Rights Reserved.</p>
        <p className="text-xs text-slate-400">
          Open-Source Toolchain • OS PDKs • Student Silicon Tape-Out
        </p>
      </div>
    </footer>
  );
}
