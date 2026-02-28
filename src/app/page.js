"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RAMADAN_START_DATE } from "./data/ramadanTimes";
import {
  usePKTClock,
  getRamadanDay,
  timeToDate,
  formatCountdown,
  to12h,
  getGregorianDate,
  ProgressRing,
  CrescentMoon,
} from "@/components/shared";
import { useCity } from "@/components/CityContext";

/* ─── Duas for daily rotation (kept on home page) ─── */
const DUAS = [
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", translation: "Our Lord, give us good in this world and good in the Hereafter." },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", translation: "My Lord, expand my chest and ease my task for me." },
  { arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", translation: "Our Lord, let not our hearts deviate after You have guided us." },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", translation: "My Lord, increase me in knowledge." },
  { arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", translation: "O Allah, You are Forgiving and love forgiveness, so forgive me." },
  { arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", translation: "Our Lord, accept from us. Indeed, You are the Hearing, the Knowing." },
];

export default function Home() {
  const { pktNow, mounted } = usePKTClock();
  const { timetable, cityName } = useCity();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const firedAlertsRef = useRef(new Set());
  const audioRef = useRef(null);

  const ramadanDay = getRamadanDay(pktNow, RAMADAN_START_DATE);
  const today = ramadanDay > 0 ? timetable[ramadanDay - 1] : null;
  const ramadanProgress = ramadanDay > 0 ? Math.round((ramadanDay / 30) * 100) : 0;

  const todayDateStr = (() => {
    if (!today) return "";
    const d = new Date(RAMADAN_START_DATE);
    d.setDate(d.getDate() + today.day - 1);
    return d.toISOString().split("T")[0];
  })();

  const fastingInfo = today
    ? (() => {
        const [sh, sm] = today.sehri.split(":").map(Number);
        const [ih, im] = today.iftar.split(":").map(Number);
        const diff = ih * 60 + im - (sh * 60 + sm);
        return `${Math.floor(diff / 60)}h ${diff % 60}m`;
      })()
    : "";

  const getTarget = useCallback(() => {
    if (!today) return { label: "", secondsLeft: 0, progress: 0, type: "none" };
    const sehriTime = timeToDate(todayDateStr, today.sehri);
    const iftarTime = timeToDate(todayDateStr, today.iftar);

    if (pktNow < sehriTime) {
      const midnight = new Date(todayDateStr); midnight.setHours(0, 0, 0, 0);
      const total = (sehriTime - midnight) / 1000;
      const elapsed = (pktNow - midnight) / 1000;
      return { label: "Until Sehri", secondsLeft: Math.max(0, Math.floor((sehriTime - pktNow) / 1000)), progress: Math.min(100, (elapsed / total) * 100), type: "sehri" };
    } else if (pktNow < iftarTime) {
      const total = (iftarTime - sehriTime) / 1000;
      const elapsed = (pktNow - sehriTime) / 1000;
      return { label: "Until Iftar", secondsLeft: Math.max(0, Math.floor((iftarTime - pktNow) / 1000)), progress: Math.min(100, (elapsed / total) * 100), type: "iftar" };
    } else {
      const nextDay = ramadanDay < 30 ? timetable[ramadanDay] : null;
      if (!nextDay) return { label: "Ramadan Mubarak!", secondsLeft: 0, progress: 100, type: "done" };
      const nd = new Date(RAMADAN_START_DATE); nd.setDate(nd.getDate() + nextDay.day - 1);
      const nextSehri = timeToDate(nd.toISOString().split("T")[0], nextDay.sehri);
      const total = (nextSehri - iftarTime) / 1000;
      const elapsed = (pktNow - iftarTime) / 1000;
      return { label: `Until Sehri (Day ${nextDay.day})`, secondsLeft: Math.max(0, Math.floor((nextSehri - pktNow) / 1000)), progress: Math.min(100, (elapsed / total) * 100), type: "sehri-next" };
    }
  }, [today, todayDateStr, pktNow, ramadanDay, timetable]);

  const target = getTarget();
  const cd = formatCountdown(target.secondsLeft);
  const duaOfDay = DUAS[((ramadanDay || 1) - 1) % DUAS.length];

  /* ─── Request browser notification permission on enable ─── */
  useEffect(() => {
    if (notifEnabled && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [notifEnabled]);

  /* ─── Alert exactly at Sehri / Iftar time ─── */
  useEffect(() => {
    if (!notifEnabled || target.type === "none" || target.type === "done") return;

    const key = target.type;
    if (target.secondsLeft === 0 && !firedAlertsRef.current.has(key)) {
      audioRef.current?.play().catch(() => {});

      const eventLabel = target.type === "iftar" ? "Iftar" : "Sehri";
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try { new Notification(`${eventLabel} Time! 🕌`, { body: `It's ${eventLabel} time now for ${cityName}.` }); } catch {}
      }

      firedAlertsRef.current.add(key);
    }

    // Reset when countdown moves to a new target
    if (target.secondsLeft > 5) firedAlertsRef.current = new Set();
  }, [target.secondsLeft, target.type, notifEnabled, cityName]);

  const formattedDate = pktNow.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const preRamadan = (() => {
    if (ramadanDay > 0) return null;
    const diff = Math.ceil((new Date(RAMADAN_START_DATE) - pktNow) / 86400000);
    if (diff > 0) return { daysUntil: diff };
    return { ended: true };
  })();

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ringColor = target.type === "iftar" ? "#f59e0b" : "#0d9488";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-gradient-to-br from-amber-100/40 to-orange-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-56 sm:w-[400px] h-56 sm:h-[400px] bg-gradient-to-bl from-teal-100/30 to-emerald-100/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-48 sm:w-[350px] h-48 sm:h-[350px] bg-gradient-to-t from-violet-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='0.5'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      <audio ref={audioRef} preload="auto" src="/notification.mp3" />

      {/* ═══ Pre-Ramadan ═══ */}
      {preRamadan && !preRamadan.ended && (
        <section className="max-w-lg mx-auto px-4 pt-10 sm:pt-16 text-center animate-fade-in">
          <div className="card p-8 sm:p-12">
            <CrescentMoon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 animate-float" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Ramadan is Approaching</h2>
            <p className="text-5xl sm:text-7xl md:text-9xl font-black bg-gradient-to-b from-amber-500 to-orange-600 bg-clip-text text-transparent my-4 sm:my-6 tabular-nums">{preRamadan.daysUntil}</p>
            <p className="text-slate-500 text-base sm:text-lg">{preRamadan.daysUntil === 1 ? "day" : "days"} remaining</p>
            <p className="text-xs text-slate-400 mt-2">for {cityName}</p>
          </div>
        </section>
      )}
      {preRamadan?.ended && (
        <section className="max-w-lg mx-auto px-4 pt-10 sm:pt-16 text-center animate-fade-in">
          <div className="card p-8 sm:p-12">
            <p className="text-lg sm:text-xl font-bold text-slate-700">Ramadan 2026 has concluded. May your prayers be accepted.</p>
          </div>
        </section>
      )}

      {/* ═══ Active Ramadan ═══ */}
      {ramadanDay > 0 && today && (
        <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-12">
          {/* Date + Status Bar */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">{formattedDate}</p>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-600">Day {ramadanDay}</span>
              <div className="hidden sm:block w-px h-4 bg-slate-200" />
              <span className="hidden sm:inline text-xs text-slate-500">of 30</span>
              <div className="w-px h-4 bg-slate-200" />
              <span className="text-[10px] sm:text-xs text-slate-400">Fasting {fastingInfo}</span>
              <div className="w-px h-4 bg-slate-200" />
              <span className="text-[10px] sm:text-xs font-semibold text-teal-600">{cityName}</span>
              <div className="hidden sm:block w-px h-4 bg-slate-200" />
              <button
                onClick={() => setNotifEnabled((p) => !p)}
                className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-lg transition-all ${notifEnabled ? "bg-amber-100 text-amber-600 ring-1 ring-amber-300" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                title={notifEnabled ? "Sound alert ON — you'll be notified at Sehri & Iftar time" : "Enable sound alert for Sehri & Iftar"}
              >
                {notifEnabled ? "🔔 Alerts ON" : "🔕 Alerts OFF"}
              </button>
            </div>
          </div>

          {/* ─── Hero: Countdown ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center mb-8 sm:mb-10">
            {/* Sehri */}
            <div className="card p-5 sm:p-7 text-center animate-slide-up hover-lift order-2 lg:order-1">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-teal-600 mb-1.5 sm:mb-2">Sehri Ends</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tabular-nums">{to12h(today.sehri)}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">Stop eating before this time</p>
            </div>

            {/* Center Countdown */}
            <div className="card card-glow p-5 sm:p-8 text-center animate-slide-up flex flex-col items-center order-1 lg:order-2" style={{ animationDelay: "0.1s" }}>
              <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-4 sm:mb-6 ${target.type === "iftar" ? "text-amber-600" : "text-teal-600"}`}>
                {target.label}
              </p>

              {target.type !== "done" ? (
                <>
                  <div className="relative inline-flex items-center justify-center" style={{ width: "min(220px, 70vw)", height: "min(220px, 70vw)" }}>
                    <ProgressRing progress={target.progress} size={220} stroke={5} color={ringColor} className="w-full h-full" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex items-baseline tabular-nums">
                        <span className="text-[28px] sm:text-[36px] md:text-[40px] font-black text-slate-800 leading-none">{cd.h}</span>
                        <span className="text-sm sm:text-base text-slate-300 mx-0.5 font-light">:</span>
                        <span className="text-[28px] sm:text-[36px] md:text-[40px] font-black text-slate-800 leading-none">{cd.m}</span>
                        <span className="text-sm sm:text-base text-slate-300 mx-0.5 font-light">:</span>
                        <span className="text-[28px] sm:text-[36px] md:text-[40px] font-black text-slate-800 leading-none">{cd.s}</span>
                      </div>
                      <div className="flex gap-6 sm:gap-[38px] mt-1">
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-slate-400">hrs</span>
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-slate-400">min</span>
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-slate-400">sec</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full mt-4 sm:mt-6">
                    <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${target.progress}%`, background: `linear-gradient(90deg, ${ringColor}, ${ringColor}cc)` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-400 mt-1.5 tabular-nums">
                      <span>{Math.round(target.progress)}% elapsed</span>
                      <span>{Math.round(100 - target.progress)}% remaining</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 sm:py-10">
                  <CrescentMoon className="w-14 h-14 sm:w-16 sm:h-16 mx-auto animate-float mb-3" />
                  <p className="text-lg sm:text-xl font-bold text-slate-700">Ramadan Mubarak!</p>
                </div>
              )}
            </div>

            {/* Iftar */}
            <div className="card p-5 sm:p-7 text-center animate-slide-up hover-lift order-3" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 18a5 5 0 00-10 0" />
                  <path d="M12 9V2M4.22 10.22l1.42 1.42M18.36 11.64l1.42-1.42M1 18h22" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-1.5 sm:mb-2">Iftar Time</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tabular-nums">{to12h(today.iftar)}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">Break your fast</p>
            </div>
          </section>

          {/* ─── Info Cards Row ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
            {/* Ramadan Progress */}
            <div className="card p-5 sm:p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Ramadan Progress</h3>
                <span className="text-xl sm:text-2xl font-black text-slate-800 tabular-nums">{ramadanProgress}<span className="text-xs sm:text-sm text-slate-400">%</span></span>
              </div>
              <div className="w-full h-2.5 sm:h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${ramadanProgress}%`, background: "linear-gradient(90deg, #f59e0b, #ef4444)" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] sm:text-[11px] text-slate-400">
                <span>Day 1</span>
                <span className="font-bold text-amber-600">{ramadanDay} / 30</span>
                <span>Day 30</span>
              </div>
            </div>

            {/* Dua */}
            <div className="card p-5 sm:p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 sm:mb-4">Dua of the Day</h3>
              <p className="text-right text-base sm:text-lg md:text-xl font-semibold text-slate-700 leading-loose mb-2 sm:mb-3" dir="rtl">
                {duaOfDay.arabic}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 italic leading-relaxed">&ldquo;{duaOfDay.translation}&rdquo;</p>
            </div>
          </div>

          {/* ─── Quick Glance: Next 3 Days ─── */}
          {ramadanDay < 28 && (
            <section className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Upcoming Days</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {timetable.slice(ramadanDay, ramadanDay + 3).map((d) => (
                  <div key={d.day} className="card px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover-lift">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500">Day {d.day}</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 ml-2">{getGregorianDate(d.day, RAMADAN_START_DATE)}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 tabular-nums text-xs sm:text-sm">
                      <span className="text-teal-600 font-semibold">{to12h(d.sehri)}</span>
                      <div className="w-px h-4 bg-slate-200" />
                      <span className="text-amber-600 font-semibold">{to12h(d.iftar)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
