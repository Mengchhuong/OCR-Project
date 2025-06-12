"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="hover:text-[#FF4438] dark:hover:text-[#FF4438] duration-300 cursor-pointer font-bold px-2 py-1 rounded text-black dark:text-white"
      onClick={toggleLanguage}
    >
      {language === "en" ? "Khmer" : "English"}
    </button>
  );
}
