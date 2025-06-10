"use client";

import React, { useState } from "react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import GeneratedResult from "@/components/file_upload/generated_result";
import FileUpload from "@/components/file_upload/file_upload";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, ArchiveRestore } from "lucide-react";
import UploadProcess from "@/components/file_upload/upload_process";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<[string, number][]>([]);
  const [showUploadProcess, setShowUploadProcess] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleGenerateOCR = () => {
    setShowUploadProcess(true);
    setTimeout(() => {
      setShowUploadProcess(false);
      setShowResult(true);
    }, 2000);
  };
  const handleUploadComplete = (newFiles: [string, number][]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };
  return (
    <div className="min-h-screen flex flex-col dark:bg-[#121212]">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div
        className={`bg-[#142544] font-bold flex flex-col items-center justify-center text-center space-y-3 text-white pt-[30px] mt-20 ${
          showResult == false ? "pb-[90px] mb-55" : "pb-[30px]"
        }`}
      >
        <p className="text-[34px]">ការប្រែក្លាយឯកសារខ្មែរទៅជាឌីជីថល</p>
        <p className="text-[34px]">
          Automating the Digitization of Khmer Documents
        </p>
        <p className="text-[22px]">
          Upload your Khmer document and get instant text extraction
        </p>
      </div>
      {/* Pass handler to FileUpload */}
      {showResult == false && (
        <FileUpload onScan={() => {}} onUploadComplete={handleUploadComplete} />
      )}
      {/* Show uploaded files */}
      <div className="flex-grow px-[144px]">
        {uploadedFiles.length > 0 && showResult == false && (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>
            <div className="flex flex-col justify-center items-center w-full">
              <ul className="space-y-3 w-full">
                {uploadedFiles.map(([filename, size], idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 dark:bg-[#121212] border-2 border-white rounded px-4 py-5 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="w-6 h-6"></FileText>
                      <span className="text-[16px]">{filename}</span>
                    </div>
                    <div className="flex items-center space-x-10">
                      {/* Format and display file size */}
                      <span className="text-[16px]">
                        {formatFileSize(size)}
                      </span>
                      <span className="text-gray-500 w-9 h-9 hover:bg-gray-300 flex items-center justify-center rounded-full cursor-pointer duration-500">
                        <Trash2 className="w-6 h-6 text-red-500"></Trash2>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4 w-[20%]"
                variant="default"
                size={"icon"}
                type="button"
                onClick={handleGenerateOCR}
              >
                <ArchiveRestore className="mr-1 w-9 h-9 stroke-3"></ArchiveRestore>
                Generate OCR Result
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow px-[144px] py-4">
        {showResult == true && (
          <div>
            <h2 className="text-xl font-bold mb-4">OCR Results</h2>
            <GeneratedResult />
          </div>
        )}
      </div>

      {/* Show upload process if showUploadProcess is true */}
      {showUploadProcess && <UploadProcess />}
      {/* Footer */}
      <Footer />
    </div>
  );
}
