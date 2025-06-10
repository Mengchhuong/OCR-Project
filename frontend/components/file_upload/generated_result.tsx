import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
const data = [
  {
    filename: "កៅ_វិចិត្រ-ឯកសារ.pdf",
    extractedText: "ប្រទេសកម្ពុជា មានប្រវត្តិសាស្ត្រដ៏យូរលង់ ហើយមា...",
    confidence: 98,
  },
  {
    filename: "example2.pdf",
    extractedText: "សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ...",
    confidence: 95,
  },
];

export default function GeneratedResult() {
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = selected.length === data.length;

  const handleSelectAll = () => {
    setSelected(allSelected ? [] : data.map((_, idx) => idx));
  };

  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const onFileClick = (fileName: String) => {
    console.log("File " + fileName + " clicked");
    alert(
      `You clicked on the file: ${fileName}. This is where you would handle the file click event, such as opening or downloading the file.`
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
                className=" cursor-pointer"
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
                <TableCell className="py-5">{row.extractedText}</TableCell>
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
                      console.log(`Downloading ${row.filename}`);
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
      <div className="flex justify-center tems-center space-x-4">
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
