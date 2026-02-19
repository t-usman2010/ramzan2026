"use client";

import { useEffect, useState } from "react";

/* ─── PKT Time Helpers (shared across all pages) ─── */

export function nowInPKT() {
  const now = new Date();
  const pktOffset = 5 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + pktOffset * 60000);
}

export function timeToDate(dateStr, timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d;
}

export function formatCountdown(totalSec) {
  if (totalSec <= 0) return { h: "00", m: "00", s: "00" };
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { h, m, s };
}

export function to12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function getRamadanDay(pktNow, startDate) {
  const start = new Date(startDate);
  const diffMs = pktNow - start;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 0 || diffDays >= 30) return 0;
  return diffDays + 1;
}

export function getGregorianDate(day, startDate) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + day - 1);
  return d.toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

/* ─── usePKTClock hook ─── */
export function usePKTClock() {
  const [mounted, setMounted] = useState(false);
  const [pktNow, setPktNow] = useState(nowInPKT());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setPktNow(nowInPKT()), 1000);
    return () => clearInterval(id);
  }, []);

  return { pktNow, mounted };
}

/* ─── Live Clock Display ─── */
export function LiveClock({ pktNow }) {
  const h = pktNow.getHours();
  const m = pktNow.getMinutes();
  const s = pktNow.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
        {String(h12).padStart(2, "0")}
        <span className="text-amber-500 animate-pulse">:</span>
        {String(m).padStart(2, "0")}
        <span className="text-amber-500 animate-pulse">:</span>
        {String(s).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase">{ampm}</span>
    </div>
  );
}

/* ─── Crescent Moon Icon ─── */
export function CrescentMoon({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="cmGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M32 6a18 18 0 1 0 0 36 15 15 0 0 1 0-36z" fill="url(#cmGrad)" />
    </svg>
  );
}

/* ─── Progress Ring (responsive) ─── */
export function ProgressRing({ progress, size = 220, stroke = 5, color = "#f59e0b", className = "" }) {
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={`transform -rotate-90 ${className}`} style={{ minWidth: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-linear"
        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
      />
    </svg>
  );
}
