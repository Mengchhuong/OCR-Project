"use client";
import React, { useState } from "react";
import "../../app/layout";
import { cadtMonoDisplay } from "../../app/fonts/fonts";

export default function LanguageToggle() {
  const [active, setActive] = useState("en");

  const toggleLanguage = () => {
    setActive((prev) => (prev === "en" ? "km" : "en"));
  };

  return (
    <button
      className={`hover:text-[#FF4438] duration-300 cursor-pointer font-bold px-2 py-1 rounded text-black c`}
      onClick={toggleLanguage}
    >
      {active === "en" ? "English" : "Khmer"}
    </button>
  );
}