# 🌙 Ramadan 2026 — Sehri & Iftar Countdown

A beautiful, responsive web app for tracking Sehri and Iftar times during Ramadan 2026. Built with Next.js 16, React 19, and Tailwind CSS.

![Ramadan 2026](https://img.shields.io/badge/Ramadan-2026-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

## ✨ Features

- **Live Countdown Timer** — Real-time countdown to Sehri and Iftar with animated progress ring
- **Multi-City Support** — Accurate prayer times for Islamabad, Lahore, and Chiniot
- **30-Day Calendar** — Complete Ramadan timetable with all Sehri/Iftar times
- **Daily Dua** — Rotating Quranic duas displayed on the home page
- **Notification System** — Optional audio alerts when it's time to break fast
- **Responsive Design** — Works beautifully on mobile, tablet, and desktop
- **Pakistan Standard Time** — All times accurately calculated for PKT (UTC+5)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ramzan2026.git
   cd ramzan2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Home page with countdown
│   ├── calendar/
│   │   └── page.js          # 30-day timetable
│   ├── data/
│   │   └── ramadanTimes.js  # Prayer times data
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── Navbar.js            # Navigation with city selector
│   ├── Footer.js            # Footer with credits
│   ├── CityContext.js       # City selection context
│   └── shared.js            # Shared utilities & components
```

## 🕌 Supported Cities

| City | Region |
|------|--------|
| Islamabad | Federal Capital |
| Lahore | Punjab |
| Chiniot | Punjab |

## ⚙️ Customization

### Adding a New City

1. Open `src/app/data/ramadanTimes.js`
2. Add your city to the `CITY_LIST` array:
   ```js
   { key: "karachi", name: "Karachi" }
   ```
3. Add the 30-day timetable to `CITY_DATA`:
   ```js
   karachi: [
     { day: 1,  sehri: "05:30", iftar: "18:15" },
     // ... all 30 days
   ]
   ```

### Updating Prayer Times

All times are stored in `src/app/data/ramadanTimes.js` in 24-hour format (HH:MM). Simply update the values for each day.

## 🛠️ Built With

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [Tailwind CSS 3.4](https://tailwindcss.com/) — Utility-first CSS
- [Inter Font](https://fonts.google.com/specimen/Inter) — Modern sans-serif typeface

## 📱 Screenshots

### Home Page
- Live countdown with progress ring
- Sehri & Iftar time cards
- Daily Dua section

### Calendar Page
- Full 30-day timetable
- Responsive table/card layout
- Current day highlighting

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Taha Usman**

- Portfolio: [bugfree-developers.vercel.app](https://bugfree-developers.vercel.app/)

---

<p align="center">
  <b>رمضان مبارک</b><br>
  May your Ramadan be blessed! 🤲
</p>
