"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import DetailResult from "./detail_result";

export default function GeneratedResult({
  uploadedFile,
}: {
  uploadedFile?: File[];
}) {
  const extractedTextRandom = [
    "ប្រទេសកម្ពុជា មានប្រវត្តិសាស្ត្រដ៏យូរលង់ ហើយមានអរិយធម៌បុរាណដ៏លេចធ្លោ ដែលបានសាងសង់វិមានប្រាសាទជាច្រើន ដូចជា ប្រាសាទអង្គរវត្ត និងអង្គរធំ។ អរិយធម៌ខ្មែរបានទទួលឥទ្ធិពលពីសាសនាព្រាង និងសាសនាពុទ្ធ តាំងពីសតវត្សទី១។",
    "សូមស្វាគមន៍មកកាន់ប្រព័ន្ធប្រែក្លាយឯកសារជាអក្សរខ្មែរ។ ប្រព័ន្ធនេះត្រូវបានរចនាឡើងដើម្បីជួយអ្នកក្នុងការបម្លែងឯកសារសរសេរជារូបភាព ឬ PDF ទៅជាអក្សរដែលអាចកែប្រែបានយ៉ាងងាយស្រួល។ វាអាចជួយអ្នកក្នុងការបញ្ចូលឯកសារទៅក្នុងប្រព័ន្ធឌីជីថល។",
    "ការប្រែក្លាយឯកសារខ្មែរទៅជាឌីជីថល គឺជាដំណើរការដែលមានសារៈសំខាន់ ដើម្បីរក្សានិងបន្តអក្សរសាស្ត្រខ្មែរ។ វាជួយក្នុងការសន្សំទុកឯកសារបែបប្រវត្តិសាស្ត្រផ្សេងៗ និងធ្វើឱ្យអាចចូលដំណើរការផលិតផលវិជ្ជាសាស្ត្របានយ៉ាងរហ័ស។",
    "ប្រព័ន្ធនេះអាចជួយអ្នកក្នុងការប្រែក្លាយឯកសារដែលមានអត្ថបទខ្មែរ ឱ្យក្លាយជាអត្ថបទដែលអាចកែសម្រួលបាន។ វាផ្តល់ជូននូវភាពងាយស្រួលក្នុងការស្វែងរក និងកែប្រែអត្ថបទ ហើយគាំទ្រការពង្រឹងប្រព័ន្ធឌីជីថលនៅក្នុងវិស័យការងាររដ្ឋ និងឯកជន។",
  ];

  const data = (uploadedFile ?? []).map((file, idx) => ({
    filename: file.name,
    extractedText: extractedTextRandom[idx % extractedTextRandom.length],
    confidence: Math.floor(Math.random() * 100) + 1,
  }));
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = selected.length === data.length;
  const [detailText, setDetailText] = useState<string | null>(null);

  if (detailText) {
    return (
      <DetailResult
        DetailText={detailText}
        FileTitle={
          data.find((row) => row.extractedText === detailText)?.filename
        }
        onBack={() => setDetailText(null)}
      />
    );
  }

  const onFileClick = (fileName: string) => {
    const found = data.find((row) => row.filename === fileName);
    if (found) setDetailText(found.extractedText);
  };

  const handleSelectAll = () => {
    setSelected(allSelected ? [] : data.map((_, idx) => idx));
  };

  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div>
      <div className="rounded-lg border-2 border-[#142544]/30 px-5">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <input
                  className="w-4 h-4 cursor-pointer"
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="font-bold py-5">Filename</TableHead>
              <TableHead className="font-bold py-5">Extracted Text</TableHead>
              <TableHead className="text-right font-bold py-5">
                Confidence
              </TableHead>
              <TableHead className="text-right font-bold py-5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={row.filename}
                className="cursor-pointer"
                onClick={() => onFileClick(row.filename)}
              >
                <TableCell>
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
                <TableCell className="py-5">{row.filename}</TableCell>
                <TableCell className="py-5">
                  {row.extractedText.length > 60
                    ? row.extractedText.slice(0, 60) + "..."
                    : row.extractedText}
                </TableCell>
                <TableCell className="text-right py-5">
                  {row.confidence}%
                </TableCell>
                <TableCell className="text-right py-5 flex justify-end">
                  <button
                    className="h-7 w-7 rounded-4xl hover:bg-gray-300 flex items-center justify-center duration-500 cursor-pointer"
                    type="button"
                    aria-label="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download logic here
                      alert(`Downloading ${row.filename}`);
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
      <div className="flex justify-center items-center">
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
          Generate New
        </Button>
      </div>
    </div>
  );
}
