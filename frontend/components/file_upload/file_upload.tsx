"use client";
import React, { useRef, useState } from "react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import UploadProcess from "./upload_process";
import { uploadFileWithProgress } from "@/lib/api";
/**
 * FileUpload component allows users to upload multiple files.
 * - Supports drag and drop or click to upload.
 * - Calls onUploadComplete with an array of [filename, filesize] after upload.
 * - Calls onScan when the Scan button is clicked.
 */
export default function FileUpload({
  onScan,
  onUploadComplete,
}: {
  onScan?: () => void;
  onUploadComplete?: (files: File[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showUploadProcess, setShowUploadProcess] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percent: 0,
  });
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
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));
    if (validFiles.length === 0) {
      alert("Only JPG, PNG, and PDF files are allowed.");
      setShowUploadProcess(false);
      return;
    }
    setShowUploadProcess(true);
    setProgress({ current: 0, total: files.length, percent: 0 });

    for (let i = 0; i < files.length; i++) {
      await uploadFileWithProgress(files[i], (percent) => {
        setProgress({
          current: i + (percent === 100 ? 1 : 0),
          total: files.length,
          percent: Math.round(((i + percent / 100) / files.length) * 100),
        });
      });
    }

    if (onUploadComplete) {
      onUploadComplete(files);
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
      <div className="absolute top-[295px] left-0 right-0 px-[144px]">
        <div className="bg-white dark:bg-[#212121] rounded-[12px] shadow-lg p-6 space-y-4">
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
            <p className="text-[16px] text-[#142544] ml-4 font-normal text-center dark:text-white">
              Drag and drop your file here, or click to browse <br />
              Supported formats: JPG, PNG, PDF | Max size: 10MB
            </p>
            <div className="flex space-x-4 mt-4 justify-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
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
                Upload
              </Button>
              <Button
                className="w-full"
                variant="default"
                size={"icon"}
                type="button"
                onClick={onScan}
              >
                <Camera className="stroke-3" />
                Scan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
