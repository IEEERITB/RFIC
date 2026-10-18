export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-slate-500 text-sm flex flex-col gap-4">
        <div className="flex flex-wrap justify-center gap-6 opacity-75 font-semibold text-slate-700">
          <span>IEEE</span>
          <span>IEEE openSilicon</span>
          <span>IEEE Bangalore Section</span>
          <span>IEEE MSRIT</span>
          <span>IEEE Sensors Council</span>
        </div>
        <p>© {new Date().getFullYear()} IEEE Sensors Council (RIT-B Chapter & IEEE Bangalore Section). All Rights Reserved.</p>
        <p className="text-xs text-slate-400">
          Open-Source Toolchain • IHP SG13G2 PDK • Micro-Specialization Series
        </p>
      </div>
    </footer>
  );
}
