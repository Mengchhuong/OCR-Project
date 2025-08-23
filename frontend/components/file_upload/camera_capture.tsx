"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { uploadFileWithProgress } from "@/lib/api";
import UploadProcess from "./upload_process";

export default function CameraCapture({
  onSave,
  onClose,
}: {
  onSave?: (file: File) => void;
  onClose?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showUploadProcess, setShowUploadProcess] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percent: 0,
  });

  // Stop the active camera stream
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setHasMounted(true);

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();

    return () => {
      document.body.style.overflow = "";
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpg");
        setCapturedImage(imageData);
      }
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const getPhotoFileName = () => {
    if (fileName && fileName.trim() !== "") {
      return fileName.endsWith(".jpg") ? fileName : `${fileName}.jpg`;
    }
    if (!hasMounted) return "photo.jpg";
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `photo_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
      now.getSeconds()
    )}.jpg`;
  };

  const handleFileSave = async () => {
    if (!capturedImage || showUploadProcess) return;
    const file = dataURLtoFile(capturedImage, getPhotoFileName());
    setShowUploadProcess(true);
    setProgress({ current: 0, total: 1, percent: 0 });

    try {
      const uploaded = await uploadFileWithProgress(file, (percent) => {
        setProgress({
          current: percent === 100 ? 1 : 0,
          total: 1,
          percent: Math.round(percent),
        });
      });
      const batchFiles: String[] = [];
      const fileUploaded = localStorage.getItem("fileuploaded");
      if (fileUploaded != null) {
        batchFiles.push(...JSON.parse(fileUploaded).map((id: string) => id));
      }

      localStorage.setItem(
        "fileuploaded",
        JSON.stringify([...batchFiles, uploaded.file_id])
      );
      onSave?.(file);

      // Close only after successful upload
      setCapturedImage(null);
      setFileName("");
      stopCamera();
      onClose?.();
    } catch (error) {
      console.error("Error uploading file:", error);
      // Leave the preview open so user can retry
    } finally {
      setShowUploadProcess(false);
      setProgress({ current: 0, total: 0, percent: 0 });
    }
  };

  if (!hasMounted) return null;

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

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 w-screen h-screen">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-screen h-screen object-contain bg-black"
        />

        <div className="absolute top-2.5 left-4 flex items-center justify-center">
          <button
            onClick={() => {
              stopCamera();
              onClose?.();
            }}
            className="text-white hover:text-gray-300 duration-200 cursor-pointer rounded-full p-2 shadow-lg hover:bg-white/40"
            disabled={showUploadProcess}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
        </div>

        <button
          onClick={capturePhoto}
          disabled={showUploadProcess}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-white/200 p-2 rounded-full text-xl shadow-lg hover:bg-blue-700 duration-200 cursor-pointer disabled:opacity-50"
        >
          <div className="bg-white p-5 rounded-full shadow-lg">
            <Camera className="w-10 h-10 text-black" />
          </div>
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {capturedImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
            <div className="relative bg-white/10 dark:bg-[#222]/60 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-white/20 backdrop-blur-lg">
              <div className="flex justify-end items-end w-full top-4 right-4 mb-6">
                <X
                  className="w-7 h-7 cursor-pointer text-white"
                  onClick={() => {
                    if (showUploadProcess) return;
                    setCapturedImage(null);
                    setFileName("");
                  }}
                />
              </div>

              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-[60vw] max-h-[60vh] rounded-xl border-4 border-white/30 shadow-lg transition-all"
              />

              <div className="flex flex-row items-center gap-6 mt-8">
                <input
                  type="text"
                  placeholder="Enter file name (optional)"
                  value={fileName}
                  disabled={showUploadProcess}
                  onChange={(e) => setFileName(e.target.value)}
                  className="text-[14px] px-4 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 text-black disabled:opacity-50"
                />
                <Button
                  onClick={handleFileSave}
                  disabled={showUploadProcess}
                  className="flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {showUploadProcess ? "Uploading..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
