"use client";

import {
  ChevronDown,
  ChevronLeft,
  Copy,
  Download,
  RefreshCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function DetailResult({
  FileTitle,
  DetailText = " ប្រទេសកម្ពុជា មានប្រវត្តិសាស្ត្រដ៏យូរលង់ ហើយមានអរិយធម៌ដ៏រុងរឿង។ខ្ញុំសូមជូនពរឱ្យអ្នកទាំងអស់គ្នាមានសុខភាពល្អ និងសុភមង្គលគ្រប់ពេលវេលា។ប្រាសាទអង្គរវត្ត គឺជានិមិត្តរូបនៃប្រទេសកម្ពុជានិងជាសំណង់ស្ថាបត្យកម្មដ៏អស្ចារ្យបំផុតមួយនៅលើពិភពលោក។",
  onBack,
}: {
  FileTitle?: string;
  DetailText?: string;
  onBack?: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div>
      <div className="border-2 border-[#142544]/30 rounded-[12] dark:border-white">
        <div className="flex flex-row justify-between border-b-2 border-[#142544]/30 pb-3 dark:border-white">
          <div className="flex items-center space-x-2 py-4 px-3">
            <div
              className="w-7 h-7 flex items-center hover:bg-gray-300 cursor-po rounded-4xl cursor-pointer"
              onClick={onBack}
            >
              <ChevronLeft className="mr-1 w-6 h-6 stroke-3"></ChevronLeft>
            </div>
            <span className="text-[16px] font-bold ml-2">
              {FileTitle || "Detail Result"}
            </span>
          </div>
          <Button
            className="mt-4 w-[8%] mr-4"
            variant="default"
            size={"icon"}
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(DetailText);
            }}
          >
            <Copy className="mr-1 w-9 h-9 stroke-3"></Copy>
            Copy
          </Button>
        </div>
        <div className="p-[20]">{DetailText}</div>
      </div>
      <div className="flex justify-center items-center space-x-12">
        <div className="w-[20%] justify-end items-end relative">
          <div className="flex flex-row items-end">
            <Button
              className="mt-4 w-[100%] rounded-r-[0]"
              variant="default"
              size={"icon"}
              type="button"
              onClick={() => {}}
            >
              <Download className="mr-1 w-9 h-9 stroke-3"></Download>
              Download .txt
            </Button>
            <span
              className="flex items-center justify-center px-2 h-9 bg-[#142544] dark:bg-[#FF4438] dark:hover:bg-[#142544]/90 hover:bg-[#142544]/90 rounded-r-[12px] cursor-pointer relative"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ChevronDown className="w-5 h-5 text-white cursor-pointer" />
            </span>
          </div>
          {dropdownOpen == true && (
            <div
              className="absolute mt-1 bg-white dark:text-[#142544] rounded-2xl justify-center items-center shadow-lg"
              style={{
                top: "100%",
                left: 0,
                width: "100%",
                zIndex: 10,
              }}
            >
              <div className="flex flex-col space-y-2">
                <span className="p-2 text-center dark:hover:duration-400 dark:hover:bg-[#142544]  hover:bg-[#FF4438] duration-400 font-bold hover:text-white cursor-pointer rounded-t-2xl">
                  Download .txt
                </span>
                <span className="p-2 text-center dark:hover:duration-400 dark:hover:bg-[#142544]  hover:bg-[#FF4438] duration-400 font-bold hover:text-white cursor-pointer rounded-b-2xl">
                  Download .json
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
          Regenerate
        </Button>
      </div>
    </div>
  );
}
