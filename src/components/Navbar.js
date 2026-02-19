"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CrescentMoon, LiveClock, usePKTClock } from "./shared";
import { useCity } from "./CityContext";
import { CITY_LIST } from "@/app/data/ramadanTimes";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { href: "/calendar", label: "Calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

/* ─── City Selector Dropdown ─── */
function CitySelector({ compact = false }) {
  const { city, changeCity, cityName } = useCity();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50 font-semibold text-slate-700 hover:bg-white/80 transition-all ${
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-1.5 text-sm"
        }`}
      >
        <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round">
          <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate max-w-[80px]">{cityName}</span>
        <svg className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden z-50 animate-fade-in">
          {CITY_LIST.map((c) => (
            <button
              key={c.key}
              onClick={() => { changeCity(c.key); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between ${
                city === c.key
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {c.name}
              {city === c.key && (
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { pktNow, mounted } = usePKTClock();

  return (
    <>
      {/* ═══ Top Navbar ═══ */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-slate-200/40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <CrescentMoon className="w-6 h-6 transition-transform group-hover:rotate-12" />
            <span className="text-base font-extrabold tracking-tight text-slate-800">
              Ramadan
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent ml-1">
                2026
              </span>
            </span>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-100"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side: City Selector + Clock */}
          <div className="flex items-center gap-2">
            <CitySelector compact />
            {/* Clock — hidden on mobile to save space */}
            <div className="hidden sm:block">
              {mounted && <LiveClock pktNow={pktNow} />}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ Mobile Bottom Nav ═══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 safe-bottom">
        <div className="flex items-center justify-around h-14">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
                  active ? "text-amber-600" : "text-slate-400"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d={link.icon} />
                </svg>
                <span className="text-[10px] font-semibold">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
