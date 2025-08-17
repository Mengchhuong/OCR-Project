"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import GeneratedResult from "@/components/file_upload/generated_result";
import FileUpload from "@/components/file_upload/file_upload";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, ArchiveRestore, X } from "lucide-react";
import UploadProcess from "@/components/file_upload/upload_process";
import { generateOCR } from "@/lib/api";
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";

type GeneratedFileInfo = {
  file_name: string;
  file_id: string;
  extract_detail: string;
  confidence: number;
  image_url: string;
};

export default function Home() {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [showUploadProcess, setShowUploadProcess] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [fileGenerated, setFileGenerated] = useState<GeneratedFileInfo[]>([]);
  let batchUploaded: string;
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percent: 0,
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    document.title = "Khmer OCR";
  }, []);

  const handleGenerateOCR = async () => {
    setShowUploadProcess(true);

    batchUploaded = localStorage.getItem("fileuploaded") || "";
    const batchResults = JSON.parse(batchUploaded) || [];

    const fileGenerated = await generateOCR((percent) => {
      setProgress({
        current: 1 + (percent === 100 ? 1 : 0),
        total: localFiles.length,
        percent: Math.round(((1 + percent / 100) / localFiles.length) * 100),
      });
    }, batchResults);

    setFileGenerated(
      fileGenerated.files.map((file: any) => ({
        file_name: file.file_name,
        file_id: file.file_id,
        extract_detail: file.extract_detail ?? "",
        confidence: file.confidence ?? 0,
        image_url: file.image_url,
      }))
    );
    setProgress({ current: 0, total: localFiles.length, percent: 0 });

    // Ensure progress shows 100%
    setProgress({
      current: localFiles.length,
      total: localFiles.length,
      percent: 100,
    });

    setShowUploadProcess(false);
    setShowResult(true);

    // Reset local progress for next run
    setProgress({ current: 0, total: 0, percent: 0 });
    localStorage.removeItem("fileuploaded");
  };

  const handleUploadComplete = (newFiles: File[]) => {
    setLocalFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <>
      <Head>
        <title>Khmer OCR</title>
        <meta name="description" content="example description" />
      </Head>
      <div className="min-h-screen flex flex-col dark:bg-[#161C24]">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <div
          className={`bg-[#142544] dark:bg-[#212B36] font-bold flex flex-col items-center justify-center text-center space-y-3 text-white pt-[30px] mt-14 md:mt-20 lg:mt-20 px-[40px] md:px-[79px] lg:px-[144px] ${
            showResult == false ? "pb-[90px] mb-55" : "pb-[30px]"
          }`}
        >
          <p className="text-[20px] md:text-[28px] lg:text-[34px]">
            ការប្រែក្លាយឯកសារខ្មែរទៅជាឌីជីថល
          </p>
          <p className="text-[20px] md:text-[28px] lg:text-[34px]">
            Automating the Digitization of Khmer Documents
          </p>
          <p className="text-[16px] md:text-[20px] lg:text-[22px]">
            {language == "en"
              ? "Upload your Khmer document and get instant text extraction"
              : "បង្ហោះឯកសារជាភាសាខ្មែររបស់អ្នក និងទទួលបានការទាញយកអត្ថបទភ្លាមៗ"}
          </p>
        </div>

        {/* File Upload */}
        {showResult == false && (
          <FileUpload
            onScan={() => {}}
            onUploadComplete={handleUploadComplete}
          />
        )}

        {/* Show uploaded files */}
        <div className="flex-grow px-[40px] md:px-[79px] lg:px-[144px]">
          {localFiles.length > 0 && showResult == false && (
            <div className="py-4">
              <h2 className="text-[16px] md:text-[20px] lg:text-[22px] font-bold mb-4">
                {language == "en" ? "Uploaded Files" : "ឯកសារដែលបានបង្ហោះ"}
              </h2>
              <div className="flex flex-col justify-center items-center w-full">
                <ul className="space-y-3 w-full">
                  {localFiles.map((file, idx) => (
                    <li
                      key={idx}
                      className="border-2 border-[#142544]/30 dark:border-white rounded-[12px] px-4 py-5 flex flex-col md:flex-col lg:flex-row justify-between items-center cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    >
                      <div className="flex items-center space-x-4">
                        <FileText className="w-6 h-6" />
                        <span className="text-[14px] md:text-[16px] lg:text-[16px]">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-10">
                        <span className="text-[14px] md:text-[16px] lg:text-[16px]">
                          {formatFileSize(file.size)}
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocalFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                          }}
                          className="text-gray-500 w-9 h-9 hover:bg-gray-300 flex items-center justify-center rounded-full cursor-pointer duration-500"
                        >
                          <Trash2 className="w-6 h-6 text-red-500" />
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-[20%] py-5"
                  variant="default"
                  size={"icon"}
                  type="button"
                  onClick={handleGenerateOCR}
                >
                  <ArchiveRestore className="mr-1 w-9 h-9 stroke-3" />
                  {language == "en"
                    ? "Generate OCR Result"
                    : "បង្កើតលទ្ធផល OCR"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-[#161C24] rounded-lg p-6 w-[70vw] max-w-[70vw] h-[90vh] max-h-[90vh] relative flex flex-col">
              <button
                className="absolute top-2 right-2 text-xl"
                onClick={() => setPreviewFile(null)}
              >
                <X className="w-6 h-6 m-3 stroke-3 text-[#142544] dark:text-white hover:text-gray-800" />
              </button>
              <h2 className="text-lg font-bold mb-4 w-[90%]">
                {previewFile.name}
              </h2>
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt={previewFile.name}
                  className="max-w-full max-h-[75vh] mx-auto"
                />
              ) : previewFile.type === "application/pdf" ? (
                <iframe
                  src={URL.createObjectURL(previewFile)}
                  title={previewFile.name}
                  className="w-full h-[75vh]"
                />
              ) : (
                <p>Preview not available for this file type.</p>
              )}
            </div>
          </div>
        )}

        {/* OCR Results */}
        <div className="flex-grow px-[144px] py-4">
          {showResult && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {language == "en" ? "OCR Results" : "លទ្ធផល OCR"}
              </h2>
              <GeneratedResult generatedFile={fileGenerated} />
            </div>
          )}
        </div>

        {/* Upload Process */}
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
    </>
  );
}
