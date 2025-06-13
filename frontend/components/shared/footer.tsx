import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="mt-auto w-full bg-[#142544] dark:bg-[#1E2A38] text-white py-8 px-4 sm:px-8 md:px-16 lg:px-36 xl:px-[144px] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
      <div className="space-y-3 text-center md:text-left">
        <p className="text-lg md:text-[22px] font-bold">
          {language == "en" ? "ADDRESS" : "អាស័យដ្ឋាន"}
        </p>
        <p className="text-sm md:text-base">
          {language == "en"
            ? "National Road 6A, Kthor, Prek Leap Chroy Changvar, Phnom Penh, Cambodia"
            : "ផ្លូវជាតិលេខ ៦A, ខ្ទរ, ព្រែកលាប ជ្រោយចង្វារ, ភ្នំពេញ, កម្ពុជា"}
        </p>
      </div>
      <div className="text-center md:text-right">
        <p className="text-sm md:text-base">
          {language == "en"
            ? "IDRI @2025 All Rights Reserved"
            : "រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ IDRI @2025"}
        </p>
      </div>
    </footer>
  );
}
