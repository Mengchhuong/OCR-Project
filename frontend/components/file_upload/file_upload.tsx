"use client";
import React, { useRef, useState } from "react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import UploadProcess from "./upload_process";
import { uploadFileWithProgress } from "@/lib/api";
import CameraCapture from "./camera_capture";
import { useLanguage } from "@/context/LanguageContext";

type UploadedFileInfo = {
  filename: string;
  url: string;
  file_id: string;
  status: string;
};
export default function FileUpload({
  onUploadComplete,
}: {
  onScan?: () => void;
  onUploadComplete?: (files: File[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUploadProcess, setShowUploadProcess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [fileuploaded, setFileuploaded] = useState<UploadedFileInfo[]>([]);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percent: 0,
  });
  const { language } = useLanguage();
  // Triggers the hidden file input when Upload button is clicked
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handles file selection and uploads files to the backend
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await handleFiles(Array.from(files));
    e.target.value = "";
  };

  // Handles files dropped into the drop area
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  const handleFiles = async (files: File[]) => {
    // Only allow jpg, png, pdf
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    // Replace spaces with underscores in file names
    const processedFiles = files.map((file) => {
      const newName = file.name.replace(/ /g, "_");
      return new File([file], newName, { type: file.type });
    });

    const validFiles = processedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );
    if (validFiles.length === 0) {
      alert("Only JPG, PNG, and PDF files are allowed.");
      setShowUploadProcess(false);
      return;
    }
    setShowUploadProcess(true);
    setProgress({ current: 0, total: files.length, percent: 0 });
    const batchFiles: string[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const result = await uploadFileWithProgress(validFiles[i], (percent) => {
        setProgress({
          current: i + (percent === 100 ? 1 : 0),
          total: validFiles.length,
          percent: Math.round(((i + percent / 100) / validFiles.length) * 100),
        });
      });
      batchFiles.push(result.file_id);
    }
    const existingRaw = localStorage.getItem("fileuploaded") || "[]";
    let existing: string[] = [];
    try {
      const parsed = JSON.parse(existingRaw);
      existing = Array.isArray(parsed) ? parsed : [];
    } catch {
      existing = [];
    }

    const finalBatchFiles = [...existing, ...batchFiles];
    localStorage.setItem("fileuploaded", JSON.stringify(finalBatchFiles));

    if (onUploadComplete) {
      onUploadComplete(validFiles);
    }

    setShowUploadProcess(false);
    setProgress({ current: 0, total: 0, percent: 0 });
  };
  // Handles drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  // Handles drag leave event
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <>
      {showUploadProcess && (
        <UploadProcess
          fromGeneratedResult={false}
          current={progress.current}
          total={progress.total}
          percent={progress.percent}
        />
      )}
      {showCamera && (
        <CameraCapture
          onSave={(file) => {
            if (onUploadComplete) onUploadComplete([file]);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
      <div className="absolute top-[295px] md:top-[275px] lg:top-[295px] left-0 right-0 px-[40px] md:px-[79px] lg:px-[144px]">
        <div className="bg-white dark:bg-[#161C24] rounded-[12px] shadow-lg p-6 space-y-4">
          <div
            className={`border-2 border-black dark:border-white rounded-[12px] py-[24px] border-dotted flex flex-col items-center justify-center space-y-3 transition-colors cursor-pointer ${
              dragActive ? "bg-blue-100 dark:bg-blue-900" : ""
            }`}
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragLeave}
          >
            <Image className="w-[222.2] h-[40] text-[#142544] dark:text-white" />
            <p className="text-[12px] md:text-[16px] lg:text-[16px] text-[#142544] ml-4 font-normal text-center dark:text-white">
              {language == "en" ? (
                <>
                  Drag and drop your file here, or click to browse
                  <br />
                  Supported formats: JPG, PNG, JPEG | Max size: 10MB
                </>
              ) : (
                <>
                  ទាញនិងទម្លាក់ឯកសាររបស់អ្នកនៅទីនេះ ឬចុចដើម្បីរុករក
                  <br />
                  ឯកសារដែលអនុញ្ញាតិ៖ JPG, PNG, JPEG | ទំហំអតិបរមា៖ 10MB
                </>
              )}
            </p>
            <div className="flex space-x-4 mt-4 justify-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,image/jpg, image/jpeg,image/png"
                onChange={handleFileChange}
              />
              <Button
                className="w-full"
                variant="default"
                type="button"
                size={"icon"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
              >
                <Upload className="stroke-3" />
                {language == "en" ? "Upload" : "បង្ហោះ"}
              </Button>
              <Button
                className="w-full"
                variant="default"
                size={"icon"}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCamera(true);
                }}
              >
                <Camera className="stroke-3" />
                {language == "en" ? "Scan" : "ស្កេន"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
