import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="mt-auto flex flex-row w-full bg-[#142544] dark:bg-[#1E2A38] text-white py-[32px] px-[144px] justify-between items-center">
      <div className="space-y-3">
        <p className="text-[22px] font-bold">
          {language == "en" ? "ADDRESS" : "អាស័យដ្ឋាន"}
        </p>
        <p>
          {language == "en"
            ? "National Road 6A, Kthor, Prek Leap Chroy Changvar, Phnom Penh, Cambodia"
            : "ផ្លូវជាតិលេខ ៦A, ខ្ទរ, ព្រែកលាប ជ្រោយចង្វារ, ភ្នំពេញ, កម្ពុជា"}
        </p>
      </div>
      <div>
        <p>
          {language == "en"
            ? "IDRI @2025 All Rights Reserved"
            : "IDRI @2025 រក្សាសិទ្ធិគ្រប់យ៉ាង"}
        </p>
      </div>
    </footer>
  );
}
