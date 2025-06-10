"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadFiles } from "@/lib/api";
import { Upload, Camera } from "lucide-react";
/**
 * FileUpload component allows users to upload multiple files.
 * - Calls onUploadComplete with an array of [filename, filesize] after upload.
 * - Calls onScan when the Scan button is clicked.
 */
export default function FileUpload({
  onScan,
  onUploadComplete,
}: {
  onScan?: () => void;
  onUploadComplete?: (files: [string, number][]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Triggers the hidden file input when Upload button is clicked
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handles file selection and uploads files to the backend
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const result = await uploadFiles(files);
    if (onUploadComplete) {
      onUploadComplete(result);
    }
  };

  return (
    <div className="absolute top-[295px] left-0 right-0 px-[144px]">
      <div className="bg-white rounded-[12px] shadow-lg p-6 space-y-4">
        <div className="border-1 border-black rounded-[12px] py-[24px] border-dotted flex flex-col items-center justify-center space-y-3">
          <Image src="/icons/Image.svg" alt="Logo" width={48} height={48} />
          <p className="text-[16px] text-[#142544] ml-4 font-normal text-center">
            Drag and drop your file here, or click to browse <br />
            Supported formats: JPG, PNG, PDF | Max size: 10MB
          </p>
          <div className="flex space-x-4 mt-4 justify-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <Button
              className="w-full"
              variant="default"
              type="button"
              size={"icon"}
              onClick={handleUploadClick}
            >
              <Upload className="stroke-3"></Upload>
              Upload
            </Button>
            <Button
              className="w-full"
              variant="default"
              size={"icon"}
              type="button"
              onClick={onScan}
            >
              <Camera className="stroke-3"></Camera>
              Scan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
