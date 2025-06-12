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
import { uploadFileWithProgress } from "@/lib/api";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showUploadProcess, setShowUploadProcess] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percent: 0,
  });

  // Simulate per-file upload progress
  const handleGenerateOCR = async () => {
    setShowUploadProcess(true);
    setProgress({ current: 0, total: uploadedFiles.length, percent: 0 });

    for (let i = 0; i < uploadedFiles.length; i++) {
      await uploadFileWithProgress(uploadedFiles[i], (percent) => {
        setProgress({
          current: i + (percent === 100 ? 1 : 0),
          total: uploadedFiles.length,
          percent: Math.round(
            ((i + percent / 100) / uploadedFiles.length) * 100
          ),
        });
      });
    }

    // Ensure progress is 100% before hiding the popup
    setProgress({
      current: uploadedFiles.length,
      total: uploadedFiles.length,
      percent: 100,
    });

    setShowUploadProcess(false);
    setShowResult(true);

    // Reset progress for next time
    setProgress({ current: 0, total: 0, percent: 0 });
  };

  const handleUploadComplete = (newFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#161C24]">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div
        className={`bg-[#142544] dark:bg-[#212B36]  font-bold flex flex-col items-center justify-center text-center space-y-3 text-white pt-[30px] mt-20 ${
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
                {uploadedFiles.map((file, idx) => (
                  <li
                    key={idx}
                    className="border-2 border-[#142544] dark:border-white rounded px-4 py-5 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="w-6 h-6"></FileText>
                      <span className="text-[16px]">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-10">
                      {/* Format and display file size */}
                      <span className="text-[16px]">
                        {formatFileSize(file.size)}
                      </span>
                      <span
                        onClick={() => {
                          setUploadedFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                        className="text-gray-500 w-9 h-9 hover:bg-gray-300 flex items-center justify-center rounded-full cursor-pointer duration-500"
                      >
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
            <GeneratedResult uploadedFile={uploadedFiles} />
          </div>
        )}
      </div>

      {/* Show upload process if showUploadProcess is true */}
      {showUploadProcess && (
        <UploadProcess
          fromGeneratedResult={true}
          current={progress.current}
          total={progress.total}
          percent={progress.percent}
        />
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
}
