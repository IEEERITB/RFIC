"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShimmerButton } from "./magicui/shimmer-button";
import { Menu, X, ArrowRight } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "#overview", label: "Overview" },
    { href: "#toolchain", label: "Toolchain" },
    { href: "#curriculum", label: "Curriculum" },
    { href: "#stakeholders", label: "Stakeholders" },
    { href: "#certification", label: "Certification" },
    { href: "#schedule", label: "Schedule" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs"
          : "border-b border-slate-200/60 bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl">
        {/* Brand / Logo */}
        <div className="flex gap-4 items-center">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
          >
            <img
              src="/logos/ieee-opensilicon.png"
              alt="IEEE openSilicon"
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:inline-block h-5 w-[1px] bg-slate-300" />
            <div className="flex flex-col">
              <span className="text-slate-900 font-extrabold tracking-tight text-base sm:text-lg leading-tight group-hover:text-sky-700 transition-colors">
                IEEE RF IC Series
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block">
                Silicon Masterclass
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg hover:text-sky-700 hover:bg-sky-50/80 transition-all duration-200 font-medium text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="#register"
            className="hidden sm:inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
          >
            <ShimmerButton
              shimmerColor="#38bdf8"
              background="#0284c7"
              borderRadius="12px"
              className="px-4 py-2 text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow-md"
            >
              Register Now
            </ShimmerButton>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-800 hover:text-sky-700 hover:bg-sky-50 transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <Link
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-3 px-5 rounded-xl text-sm shadow-md transition-all active:scale-95"
              >
                <span>Register for Masterclass</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
