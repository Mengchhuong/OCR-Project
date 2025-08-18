"use client";

import {
  ChevronDown,
  ChevronLeft,
  Copy,
  Download,
  RefreshCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { get_extract_json_url } from "@/lib/api";

export default function DetailResult({
  FileTitle,
  FileID,
  DetailText = " ប្រទេសកម្ពុជា មានប្រវត្តិសាស្ត្រដ៏យូរលង់ ហើយមានអរិយធម៌ដ៏រុងរឿង។ខ្ញុំសូមជូនពរឱ្យអ្នកទាំងអស់គ្នាមានសុខភាពល្អ និងសុភមង្គលគ្រប់ពេលវេលា។ប្រាសាទអង្គរវត្ត គឺជានិមិត្តរូបនៃប្រទេសកម្ពុជានិងជាសំណង់ស្ថាបត្យកម្មដ៏អស្ចារ្យបំផុតមួយនៅលើពិភពលោក។",
  Image_url,
  onBack,
}: {
  FileTitle?: string;
  FileID?: string;
  Image_url?: string;
  DetailText?: string;
  onBack?: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const { language } = useLanguage();

  useLayoutEffect(() => {
    if (buttonGroupRef.current) {
      setDropdownWidth(buttonGroupRef.current.offsetWidth);
    }
  }, [dropdownOpen]);

  const onSelectDownload = async (
    filename: string,
    file_id: string,
    type: string
  ) => {
    const fileId = file_id;
    if (!fileId) {
      console.error("No file id found for this row.");
      return;
    }

    const extract_json_url = await get_extract_json_url(fileId);
    if (!extract_json_url) {
      console.error("Extracted JSON is not available for this file.");
      return;
    }

    const res = await fetch(extract_json_url.toString());
    if (!res.ok) {
      console.error(`Failed to fetch extracted JSON (status ${res.status}).`);
      return;
    }

    const jsonData = await res.json();
    if (type == "json") {
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${cleanFileName(filename)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "text/plain",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${cleanFileName(filename)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };
  function cleanFileName(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
  }

  function formatExtractedText(extractedText: any[]) {
    if (!extractedText || extractedText.length === 0) return "No data found.";

    const item = extractedText[0];
    return `
<b>ខេត្ត ក្រុង:</b>: ${item.city}
<b>ស្រុក ខណ្ឌ:</b> ${item.district}
<b>ឃុំ សង្កាត់:</b> ${item.commune}

<b>លេខ:</b> ${item.certificate_number} 
<b>សៀវភៅបញ្ជាក់កំណើតលេខ:</b> ${item.doc_number} 
<b>ឆ្នាំ:</b> ${item.certificate_year}

<b>នាមត្រកូល:</b> ${item.last_name}
<b>នាមខ្លួនអ្នកកើត:</b> ${item.first_name}
<b>ភេទ:</b> ${item.gender}
<b>សញ្ជាតិ:</b> ${item.nationality}
<b>ថ្ងៃខែឆ្នាំកំណើត:</b> ${item.dob}
<b>ទីកន្លែងកំណើត:</b> ${item.pob}

<b>+ ជាឡាតាំង</b>
<b>នាមត្រកូល:</b> ${item.last_name_latin}
<b>នាមខ្លួន:</b> ${item.first_name_latin}

<b>+ ឪពុក:</b>
<b>ឈ្មោះ:</b> ${item.father_name}
<b>ឈ្មោះឡាតាំង:</b> ${item.father_name_latin}
<b>សញ្ជាតិ:</b> ${item.father_nationality}
<b>ថ្ងែ ខែ ឆ្នាំ កំណើត:</b> ${item.father_dob}
<b>ទីកន្លែងកំណើត:</b> ${item.father_pob}

<b>+ ម្តាយ:</b>
<b>ឈ្មោះ:</b> ${item.mother_name} 
<b>ឈ្មោះឡាតាំង:</b> ${item.mother_name_latin}
<b>សញ្ជាតិ:</b> ${item.mother_nationality}
<b>ថ្ងែ ខែ ឆ្នាំ កំណើត:</b> ${item.mother_dob}
<b>ទីកន្លែងកំណើត:</b> ${item.mother_pob}

<b>ទីលំនៅពេលទារកកើត:</b> ${item.first_pob_baby}

<b>ធ្វើនៅ:</b> ${item.created_place}, <b>ថ្ងែទី:</b> ${item.created_date} <b>ខែ:</b> ${item.create_month} <b>ឆ្នាំ:</b> ${item.create_year}
<b>មន្ត្រីអត្រានុកូលដ្ឋាន:</b> ${item.created_by}
<b>ហត្ថលេខា:</b> ${item.signature}
  `.trim();
  }
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);
  return (
    <div>
      <div className="border-2 border-[#142544]/30 rounded-[12px] dark:border-white">
        <div className="flex flex-row items-center gap-x-8 py-4 px-3 h-full border-b-2 border-[#142544]/30 dark:border-white justify-between">
          <div className="flex items-center">
            <div
              className="w-7 h-7 flex items-center hover:bg-gray-300 dark:hover:bg-[#142544]/80 rounded-4xl cursor-pointer"
              onClick={onBack}
            >
              <ChevronLeft className="mr-1 w-6 h-6 stroke-3"></ChevronLeft>
            </div>
            <span className="text-[16px] font-bold ml-2 flex items-center">
              {FileTitle || "Detail Result"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-x-4 w-[30%]">
            <Button
              className="w-[40%]"
              variant="default"
              size={"icon"}
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(DetailText);
                setTimeout(() => {
                  setCopied(true);
                }, 100);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            >
              <Copy className="mr-1 w-9 h-9 stroke-3"></Copy>
              {copied ? (
                <div>{language == "en" ? "Copied!" : "បានចម្លង"}</div>
              ) : (
                <div>{language == "en" ? "Copy" : "ចម្លង"}</div>
              )}
            </Button>
          </div>
        </div>
        <div className="p-[20] leading-9 flex space-x-5">
          <div className="w-[50%] space-y-5">
            <h1 className="font-semibold text-[16px] md:text-[20px] lg:text-[22px] text-center">
              {language == "en" ? "Your Input" : "ការបញ្ចូលរបស់អ្នក"}
            </h1>
            <embed src={Image_url} className="w-full h-auto" />
          </div>
          <div className="w-[50%] space-y-3">
            <h1 className="font-semibold text-[16px] md:text-[20px] lg:text-[22px] text-center">
              {language == "en" ? "Our Result" : "លទ្ធផលដែលបង្កើតឡើង"}
            </h1>
            <p
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: DetailText }}
            ></p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-12">
        <div className="w-[20%] justify-end items-end relative">
          <div className="flex flex-row items-end" ref={buttonGroupRef}>
            <Button
              className="mt-4 w-[100%] rounded-r-[0]"
              variant="default"
              size={"icon"}
              type="button"
              onClick={() => {
                onSelectDownload(FileTitle || "result", FileID || "", "txt");
              }}
            >
              <Download className="mr-1 w-9 h-9 stroke-3"></Download>
              {language == "en" ? "Download .txt" : "ទាញយក .txt"}
            </Button>
            <span
              className="flex items-center justify-center px-2 h-9 bg-[#142544] dark:bg-[#2998EF] border-l-1 border-white duration-500 dark:hover:bg-[#2998EF]/70 hover:bg-[#142544]/70 rounded-r-[12px] cursor-pointer relative select-none"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((prev) => !prev);
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ChevronDown className="w-5 h-5 text-white cursor-pointer" />
            </span>
          </div>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute mt-1 bg-white dark:text-[#142544] rounded-2xl justify-center items-center shadow-lg"
              style={{
                top: "100%",
                left: 0,
                width: dropdownWidth ? `${dropdownWidth}px` : "100%",
                zIndex: 10,
              }}
            >
              <div className="flex flex-col">
                <span
                  className="p-2 text-center dark:hover:duration-500 dark:hover:bg-[#142544]  hover:bg-[#FF4438] duration-500 font-bold hover:text-white cursor-pointer rounded-t-2xl"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen),
                      onSelectDownload(
                        FileTitle || "result",
                        FileID || "",
                        "txt"
                      );
                  }}
                >
                  {language == "en" ? "Download .txt" : "ទាញយក .txt"}
                </span>
                <span
                  className="p-2 text-center dark:hover:duration-500 dark:hover:bg-[#142544]  hover:bg-[#FF4438] duration-500 font-bold hover:text-white cursor-pointer rounded-b-2xl"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen),
                      onSelectDownload(
                        FileTitle || "result",
                        FileID || "",
                        "json"
                      );
                  }}
                >
                  {language == "en" ? "Download .json" : "ទាញយក .json"}
                </span>
              </div>
            </div>
          )}
        </div>
        <Button
          className="mt-4 w-[20%]"
          variant="default"
          size={"icon"}
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          <RefreshCcw className="mr-1 w-9 h-9 stroke-3"></RefreshCcw>
          {language == "en" ? "Regenerate" : "បង្កើតម្ដងទៀត"}
        </Button>
      </div>
    </div>
  );
}
