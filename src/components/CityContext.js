"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_CITY, CITY_LIST, CITY_DATA } from "@/app/data/ramadanTimes";

const CityCtx = createContext();

export function CityProvider({ children }) {
  const [city, setCity] = useState(DEFAULT_CITY);

  // Persist city choice in localStorage
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("ramadan_city");
    if (saved && CITY_DATA[saved]) setCity(saved);
  }, []);

  const changeCity = (key) => {
    setCity(key);
    localStorage.setItem("ramadan_city", key);
  };

  return (
    <CityCtx.Provider value={{ city, changeCity, timetable: CITY_DATA[city] || CITY_DATA[DEFAULT_CITY], cityName: CITY_LIST.find((c) => c.key === city)?.name || "Islamabad" }}>
      {children}
    </CityCtx.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityCtx);
  if (!ctx) throw new Error("useCity must be used inside CityProvider");
  return ctx;
}
