"use client";

import { RAMADAN_START_DATE } from "../data/ramadanTimes";
import { usePKTClock, getRamadanDay, to12h, getGregorianDate } from "@/components/shared";
import { useCity } from "@/components/CityContext";

export default function CalendarPage() {
  const { pktNow, mounted } = usePKTClock();
  const { timetable, cityName } = useCity();
  const ramadanDay = getRamadanDay(pktNow, RAMADAN_START_DATE);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mb-1 sm:mb-2">
          30-Day <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Timetable</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Sehri & Iftar times for <span className="font-semibold text-teal-600">{cityName}</span>, Pakistan
        </p>
      </div>

      {/* ─── Stats Bar ─── */}
      {ramadanDay > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 animate-slide-up">
          <div className="card px-3 sm:px-4 py-2.5 sm:py-3 text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 sm:mb-1">Completed</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">{ramadanDay - 1}</p>
          </div>
          <div className="card px-3 sm:px-4 py-2.5 sm:py-3 text-center border-amber-200 bg-amber-50/50">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-600 mb-0.5 sm:mb-1">Today</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 tabular-nums">Day {ramadanDay}</p>
          </div>
          <div className="card px-3 sm:px-4 py-2.5 sm:py-3 text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 sm:mb-1">Remaining</p>
            <p className="text-xl sm:text-2xl font-black text-slate-600 tabular-nums">{30 - ramadanDay}</p>
          </div>
        </div>
      )}

      {/* ─── Calendar — Mobile: card list / Desktop: table ─── */}

      {/* Desktop Table */}
      <div className="hidden sm:block card animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {/* Header */}
        <div className="grid grid-cols-[56px_1fr_1fr_1fr] md:grid-cols-[64px_1fr_1fr_1fr] bg-slate-50 border-b border-slate-200/60 rounded-t-2xl -mx-5 -mt-4 px-5">
          <div className="px-2 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Day</div>
          <div className="px-2 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Date</div>
          <div className="px-2 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-teal-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/></svg>
              Sehri
            </span>
          </div>
          <div className="px-2 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 18a5 5 0 00-10 0M1 18h22"/></svg>
              Iftar
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="-mx-5 -mb-4">
          {timetable.map((row) => {
            const isToday = row.day === ramadanDay;
            const isPast = row.day < ramadanDay;
            return (
              <div
                key={row.day}
                className={`grid grid-cols-[56px_1fr_1fr_1fr] md:grid-cols-[64px_1fr_1fr_1fr] text-sm transition-all border-b last:border-b-0 ${
                  isToday
                    ? "bg-amber-50/70 border-l-[3px] border-l-amber-400 shadow-sm"
                    : isPast
                    ? "opacity-40 hover:opacity-60"
                    : "border-l-[3px] border-l-transparent hover:bg-slate-50/70 border-b-slate-100/40"
                }`}
              >
                <div className={`px-2 py-3 text-center font-bold ${isToday ? "text-amber-600" : "text-slate-600"}`}>
                  {row.day}
                  {isToday && <span className="block text-[8px] font-extrabold text-amber-500 leading-none mt-0.5 animate-pulse">TODAY</span>}
                  {isPast && <span className="block text-[8px] text-emerald-500 leading-none mt-0.5">✓</span>}
                </div>
                <div className="px-2 py-3 text-center text-slate-400 text-xs flex items-center justify-center">
                  {getGregorianDate(row.day, RAMADAN_START_DATE)}
                </div>
                <div className={`px-2 py-3 text-center tabular-nums font-semibold ${isToday ? "text-teal-700" : "text-teal-600/80"}`}>
                  {to12h(row.sehri)}
                </div>
                <div className={`px-2 py-3 text-center tabular-nums font-semibold ${isToday ? "text-amber-700" : "text-amber-600/80"}`}>
                  {to12h(row.iftar)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {timetable.map((row) => {
          const isToday = row.day === ramadanDay;
          const isPast = row.day < ramadanDay;
          return (
            <div
              key={row.day}
              className={`card px-4 py-3 flex items-center gap-3 transition-all ${
                isToday
                  ? "border-amber-200 bg-amber-50/60 shadow-md"
                  : isPast
                  ? "opacity-40"
                  : ""
              }`}
            >
              {/* Day badge */}
              <div className={`shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center ${
                isToday
                  ? "bg-amber-500 text-white"
                  : isPast
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-600"
              }`}>
                <span className="text-sm font-black leading-none">{row.day}</span>
                {isPast && <span className="text-[7px] leading-none">✓</span>}
                {isToday && <span className="text-[7px] leading-none font-bold">TODAY</span>}
              </div>

              {/* Date */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 truncate">{getGregorianDate(row.day, RAMADAN_START_DATE)}</p>
              </div>

              {/* Times */}
              <div className="shrink-0 text-right space-y-0.5">
                <p className="text-xs tabular-nums">
                  <span className="text-teal-600 font-semibold">{to12h(row.sehri)}</span>
                </p>
                <p className="text-xs tabular-nums">
                  <span className="text-amber-600 font-semibold">{to12h(row.iftar)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-4 sm:mt-6">
        All times are in Pakistan Standard Time (PKT / UTC+5) for {cityName}
      </p>
    </div>
  );
}
