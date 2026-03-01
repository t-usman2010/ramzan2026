// ============================================================
// 🕌 RAMADAN 2026 — SEHRI & IFTAR TIMES (Multi-City)
// ============================================================
// ✏️  HOW TO EDIT:
//   - Each city has its own 30-day timetable array.
//   - "sehri" = Sehri (Sahoor) end time in 24-hour format "HH:MM"
//   - "iftar" = Iftar time in 24-hour format "HH:MM"
//   - All times are in Pakistan Standard Time (PKT / UTC+5).
//
// 📅  Ramadan 2026 starts on February 19, 2026 in Pakistan.
//     Adjust RAMADAN_START_DATE below if the moon is sighted
//     on a different date.
// ============================================================

/** @type {string} The Gregorian date when Ramadan Day 1 begins (YYYY-MM-DD) */
export const RAMADAN_START_DATE = "2026-02-19";

/** List of supported cities (key must match CITY_DATA keys) */
export const CITY_LIST = [
  { key: "islamabad", name: "Islamabad" },
  { key: "lahore",    name: "Lahore" },
  { key: "chiniot",   name: "Chiniot" },
];

export const DEFAULT_CITY = "islamabad";

/**
 * Per-city Sehri & Iftar timetable for all 30 days.
 * ✏️  Replace the times below with your local masjid / official values.
 */
export const CITY_DATA = {
  // ───────────────── ISLAMABAD ─────────────────
  islamabad: [
    { day: 1,  sehri: "05:24", iftar: "17:56" },
    { day: 2,  sehri: "05:23", iftar: "17:57" },
    { day: 3,  sehri: "05:22", iftar: "17:58" },
    { day: 4,  sehri: "05:21", iftar: "17:59" },
    { day: 5,  sehri: "05:20", iftar: "18:00" },
    { day: 6,  sehri: "05:19", iftar: "18:01" },
    { day: 7,  sehri: "05:18", iftar: "18:02" },
    { day: 8,  sehri: "05:16", iftar: "18:03" },
    { day: 9,  sehri: "05:15", iftar: "18:03" },
    { day: 10, sehri: "05:14", iftar: "18:04" },
    { day: 11, sehri: "05:13", iftar: "18:05" },
    { day: 12, sehri: "05:12", iftar: "18:06" },
    { day: 13, sehri: "05:11", iftar: "18:07" },
    { day: 14, sehri: "05:09", iftar: "18:08" },
    { day: 15, sehri: "05:08", iftar: "18:08" },
    { day: 16, sehri: "05:07", iftar: "18:09" },
    { day: 17, sehri: "05:06", iftar: "18:10" },
    { day: 18, sehri: "05:04", iftar: "18:11" },
    { day: 19, sehri: "05:03", iftar: "18:12" },
    { day: 20, sehri: "05:02", iftar: "18:12" },
    { day: 21, sehri: "05:00", iftar: "18:13" },
    { day: 22, sehri: "04:59", iftar: "18:14" },
    { day: 23, sehri: "04:58", iftar: "18:15" },
    { day: 24, sehri: "04:56", iftar: "18:16" },
    { day: 25, sehri: "04:55", iftar: "18:16" },
    { day: 26, sehri: "04:54", iftar: "18:17" },
    { day: 27, sehri: "04:52", iftar: "18:18" },
    { day: 28, sehri: "04:51", iftar: "18:19" },
    { day: 29, sehri: "04:49", iftar: "18:19" },
    { day: 30, sehri: "04:48", iftar: "18:20" },
  ],

  // ───────────────── LAHORE ─────────────────
  lahore: [
    
    { day: 1,  sehri: "05:19", iftar: "17:52" },
    { day: 2,  sehri: "05:18", iftar: "17:53" },
    { day: 3,  sehri: "05:17", iftar: "17:54" },
    { day: 4,  sehri: "05:16", iftar: "17:55" },
    { day: 5,  sehri: "05:15", iftar: "17:56" },
    { day: 6,  sehri: "05:14", iftar: "17:56" },
    { day: 7,  sehri: "05:13", iftar: "17:57" },
    { day: 8,  sehri: "05:12", iftar: "17:58" },
    { day: 9,  sehri: "05:11", iftar: "17:59" },
    { day: 10, sehri: "05:10", iftar: "17:59" },
    { day: 11, sehri: "05:09", iftar: "18:00" },
    { day: 12, sehri: "05:08", iftar: "18:01" },
    { day: 13, sehri: "05:07", iftar: "18:02" },
    { day: 14, sehri: "05:06", iftar: "18:02" },
    { day: 15, sehri: "05:05", iftar: "18:03" },
    { day: 16, sehri: "05:03", iftar: "18:04" },
    { day: 17, sehri: "05:02", iftar: "18:05" },
    { day: 18, sehri: "05:01", iftar: "18:05" },
    { day: 19, sehri: "05:00", iftar: "18:06" },
    { day: 20, sehri: "04:59", iftar: "18:07" },
    { day: 21, sehri: "04:57", iftar: "18:07" },
    { day: 22, sehri: "04:56", iftar: "18:08" },
    { day: 23, sehri: "04:55", iftar: "18:09" },
    { day: 24, sehri: "04:54", iftar: "18:10" },
    { day: 25, sehri: "04:52", iftar: "18:10" },
    { day: 26, sehri: "04:51", iftar: "18:11" },
    { day: 27, sehri: "04:50", iftar: "18:12" },
    { day: 28, sehri: "04:48", iftar: "18:12" },
    { day: 29, sehri: "04:47", iftar: "18:13" },
    { day: 30, sehri: "04:46", iftar: "18:14" },
  ],

  // ───────────────── CHINIOT ─────────────────
  chiniot: [
    { day: 1,  sehri: "05:24", iftar: "17:59" },
    { day: 2,  sehri: "05:23", iftar: "18:00" },
    { day: 3,  sehri: "05:22", iftar: "18:01" },
    { day: 4,  sehri: "05:21", iftar: "18:01" },
    { day: 5,  sehri: "05:20", iftar: "18:02" },
    { day: 6,  sehri: "05:19", iftar: "18:03" },
    { day: 7,  sehri: "05:18", iftar: "18:04" },
    { day: 8,  sehri: "05:17", iftar: "18:04" },
    { day: 9,  sehri: "05:16", iftar: "18:05" },
    { day: 10, sehri: "05:15", iftar: "18:06" },
    { day: 11, sehri: "05:14", iftar: "18:07" },
    { day: 12, sehri: "05:13", iftar: "18:08" },
    { day: 13, sehri: "05:11", iftar: "18:08" },
    { day: 14, sehri: "05:10", iftar: "18:09" },
    { day: 15, sehri: "05:09", iftar: "18:10" },
    { day: 16, sehri: "05:08", iftar: "18:11" },
    { day: 17, sehri: "05:07", iftar: "18:11" },
    { day: 18, sehri: "05:06", iftar: "18:12" },
    { day: 19, sehri: "05:04", iftar: "18:13" },
    { day: 20, sehri: "05:03", iftar: "18:13" },
    { day: 21, sehri: "05:02", iftar: "18:14" },
    { day: 22, sehri: "05:01", iftar: "18:15" },
    { day: 23, sehri: "04:59", iftar: "18:16" },
    { day: 24, sehri: "04:58", iftar: "18:16" },
    { day: 25, sehri: "04:57", iftar: "18:17" },
    { day: 26, sehri: "04:55", iftar: "18:18" },
    { day: 27, sehri: "04:54", iftar: "18:18" },
    { day: 28, sehri: "04:53", iftar: "18:19" },
    { day: 29, sehri: "04:51", iftar: "18:20" },
    { day: 30, sehri: "04:50", iftar: "18:20" },
  ],
};
