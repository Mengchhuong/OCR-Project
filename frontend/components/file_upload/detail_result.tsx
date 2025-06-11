"use client";

import { ChevronLeft, Copy, Download } from "lucide-react";
import { Button } from "../ui/button";

export default function DetailResult({
  FileTitle,
  DetailText = " ប្រទេសកម្ពុជា មានប្រវត្តិសាស្ត្រដ៏យូរលង់ ហើយមានអរិយធម៌ដ៏រុងរឿង។ខ្ញុំសូមជូនពរឱ្យអ្នកទាំងអស់គ្នាមានសុខភាពល្អ និងសុភមង្គលគ្រប់ពេលវេលា។ប្រាសាទអង្គរវត្ត គឺជានិមិត្តរូបនៃប្រទេសកម្ពុជានិងជាសំណង់ស្ថាបត្យកម្មដ៏អស្ចារ្យបំផុតមួយនៅលើពិភពលោក។",
  onBack,
}: {
  FileTitle?: string;
  DetailText?: string;
  onBack?: () => void;
}) {
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
      <div className="flex justify-center items-center space-x-4">
        <Button
          className="mt-4 w-[20%]"
          variant="default"
          size={"icon"}
          type="button"
        >
          <Download className="mr-1 w-9 h-9 stroke-3"></Download>
          Download Txt
        </Button>
        <Button
          className="mt-4 w-[20%]"
          variant="default"
          size={"icon"}
          type="button"
        >
          <Download className="mr-1 w-9 h-9 stroke-3"></Download>
          Download Json
        </Button>
      </div>
    </div>
  );
}
