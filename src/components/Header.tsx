import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-4 items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logos/ieee-opensilicon.png" 
              alt="IEEE openSilicon" 
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="hidden sm:inline-block h-5 w-[1px] bg-slate-300" />
            <span className="text-slate-900 font-bold tracking-tight text-lg md:text-xl">IEEE RF IC Series</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link href="#overview" className="hover:text-sky-600 transition-colors">Overview</Link>
          <Link href="#toolchain" className="hover:text-sky-600 transition-colors">Toolchain</Link>
          <Link href="#curriculum" className="hover:text-sky-600 transition-colors">Curriculum</Link>
          <Link href="#speakers" className="hover:text-sky-600 transition-colors">Speakers</Link>
          <Link href="#schedule" className="hover:text-sky-600 transition-colors">Schedule</Link>
        </nav>
        <div>
          <Link href="#register" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-md shadow-sky-600/20">
            Register Now
          </Link>
        </div>
      </div>
    </header>
  );
}
