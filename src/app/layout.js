import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CityProvider } from "@/components/CityContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Ramadan 2026 — Sehri & Iftar Countdown",
  description:
    "Live Ramadan 2026 Sehri & Iftar countdown timer with full 30-day calendar for Islamabad, Lahore & Chiniot, Pakistan.",
  keywords: ["Ramadan 2026", "Sehri", "Iftar", "Islamabad", "Lahore", "Chiniot", "countdown", "Pakistan"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <CityProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
        </CityProvider>
      </body>
    </html>
  );
}
