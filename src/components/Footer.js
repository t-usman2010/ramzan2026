"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-emerald-200 text-sm">
          Made with by{" "}
          <a
            href="https://bugfree-developers.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white hover:text-emerald-300 transition-colors underline underline-offset-2"
          >
            Taha Usman
          </a>
        </p>
        <p className="text-emerald-300/60 text-xs mt-2">
          Ramadan 2026 • رمضان مبارک
        </p>
      </div>
    </footer>
  );
}
