"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCcw, ChevronDown } from "lucide-react";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Button } from "../ui/button";
import DetailResult from "./detail_result";
import { useLanguage } from "@/context/LanguageContext";
import { get_extract_json_url } from "@/lib/api";
type GeneratedFileInfo = {
  file_name: string;
  file_id: string;
  extract_detail: string;
  confidence: number;
  image_url: string;
};

export default function GeneratedResult({
  generatedFile,
}: {
  generatedFile?: GeneratedFileInfo[];
}) {
  const data = (generatedFile ?? []).map((file) => ({
    filename: file.file_name,
    extractedText: file.extract_detail,
    confidence: file.confidence,
    image_url: file.image_url,
    file_id: file.file_id,
  }));
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = selected.length === data.length;
  // Replace detailText with an object holding text + metadata
  const [detail, setDetail] = useState<{
    text: string;
    image_url?: string;
    filename: string;
    file_id: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const [extract_text, setExtractText] = useState<JSON | null>(null);
  const { language } = useLanguage();

  useLayoutEffect(() => {
    if (buttonGroupRef.current) {
      setDropdownWidth(buttonGroupRef.current.offsetWidth);
    }
  }, [dropdownOpen]);

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

  if (detail) {
    return (
      <DetailResult
        DetailText={detail.text}
        FileID={detail.file_id}
        Image_url={detail.image_url}
        FileTitle={detail.filename}
        onBack={() => setDetail(null)}
      />
    );
  }

  const onFileClick = async (row: (typeof data)[0]) => {
    try {
      const fileId = row.file_id;
      if (!fileId) {
        setDetail({
          text: "No file id found for this row.",
          image_url: row.image_url,
          filename: row.filename,
          file_id: row.file_id,
        });
        return;
      }

      const extract_json_url = await get_extract_json_url(fileId);
      if (!extract_json_url) {
        setDetail({
          text: "Extracted JSON is not available for this file.",
          image_url: row.image_url,
          filename: row.filename,
          file_id: row.file_id,
        });
        return;
      }

      const res = await fetch(extract_json_url.toString());
      if (!res.ok) {
        setDetail({
          text: `Failed to fetch extracted JSON (status ${res.status}).`,
          image_url: row.image_url,
          filename: row.filename,
          file_id: row.file_id,
        });
        return;
      }

      const jsonData = await res.json();

      const formattedText = formatExtractedText(jsonData.extracted_text);
      setDetail({
        text: formattedText,
        image_url: row.image_url,
        filename: row.filename,
        file_id: row.file_id,
      });

      setExtractText(jsonData);
    } catch (err) {
      console.error("Failed to fetch JSON:", err);
      setDetail({
        text: "An error occurred while fetching the extracted JSON.",
        image_url: row.image_url,
        filename: row.filename,
        file_id: row.file_id,
      });
    }
  };

  const onDownloadClick = async (row: (typeof data)[0]) => {
    try {
      const fileId = row.file_id;
      const extract_json_url = await get_extract_json_url(fileId);

      const res = await fetch(extract_json_url.toString());
      if (!res.ok) {
        console.error(`Failed to fetch extracted JSON (status ${res.status}).`);
        return;
      }
      const filename = cleanFileName(row.filename);
      const jsonData = await res.json();
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to fetch JSON:", err);
    }
  };

  const onSelectDownload = async (row: (typeof data)[0], type: string) => {
    const fileId = row.file_id;
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
      link.download = `${cleanFileName(row.filename)}.json`;
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
      link.download = `${cleanFileName(row.filename)}.txt`;
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

  const handleSelectAll = () => {
    setSelected(allSelected ? [] : data.map((_, idx) => idx));
  };

  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleBatchDownload = async (type: "txt" | "json") => {
    if (selected.length === 0) {
      alert("Please select at least one file to download.");
      return;
    }

    for (const idx of selected) {
      const row = data[idx];
      await onSelectDownload(row, type);
    }
  };

  return (
    <div>
      <div className="rounded-lg border-2 border-[#142544]/30 dark:border-white px-5">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">
                <input
                  className="w-4 h-4 cursor-pointer"
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="font-bold py-5 text-center">
                {language == "en" ? "Filename" : "ឈ្មោះឯកសារ"}
              </TableHead>
              <TableHead className="font-bold py-5 text-center">
                {language == "en" ? "Extracted Text" : "​អត្ថបទដែលបានទាញយក"}
              </TableHead>
              <TableHead className="font-bold py-5 text-center">
                {language == "en" ? "Confidence" : "ប្រាកដភាព"}
              </TableHead>
              <TableHead className="font-bold py-5 text-center">
                {language == "en" ? "Action" : "សកម្មភាព"}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={row.filename}
                className="cursor-pointer text-center"
                onClick={() => onFileClick(row)}
              >
                <TableCell className="text-center">
                  <input
                    className="w-4 h-4 cursor-pointer"
                    type="checkbox"
                    checked={selected.includes(idx)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(idx);
                    }}
                    onChange={() => {}}
                    aria-label={`Select ${row.filename}`}
                  />
                </TableCell>
                <TableCell className="py-5 text-center">
                  {row.filename}
                </TableCell>
                <TableCell className="py-5 text-center">
                  {row.extractedText.length > 60
                    ? row.extractedText.slice(0, 60) + "..."
                    : row.extractedText}
                </TableCell>
                <TableCell className="py-5 text-center">
                  {row.confidence}%
                </TableCell>
                <TableCell className="py-5 text-center">
                  <button
                    className="h-7 w-7 rounded-4xl hover:bg-gray-300 flex items-center justify-center duration-500 cursor-pointer mx-auto"
                    type="button"
                    aria-label="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadClick(row);
                    }}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                handleBatchDownload("txt");
              }}
            >
              <Download className="mr-1 w-9 h-9 stroke-3"></Download>
              {language == "en" ? "Download .txt" : "ទាញយក .txt"}
            </Button>
            <span
              className="flex items-center justify-center px-2 h-9 bg-[#142544] dark:bg-[#2998EF] border-l-1 border-white duration-500 dark:hover:bg-[#2998EF]/70 hover:bg-[#142544]/70 rounded-r-[12px] cursor-pointer relative select-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
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
                    setDropdownOpen(!dropdownOpen), handleBatchDownload("txt");
                  }}
                >
                  {language == "en" ? "Download .txt" : "ទាញយក .txt"}
                </span>
                <span
                  className="p-2 text-center dark:hover:duration-500 dark:hover:bg-[#142544]  hover:bg-[#FF4438] duration-500 font-bold hover:text-white cursor-pointer rounded-b-2xl"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen), handleBatchDownload("json");
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
