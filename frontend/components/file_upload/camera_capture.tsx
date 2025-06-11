"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft } from "lucide-react";

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
  const [hasMounted, setHasMounted] = useState(false);

  // Helper to stop the camera stream
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
        const imageData = canvas.toDataURL("image/png");
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
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `photo_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
      now.getSeconds()
    )}.png`;
  };

  if (!hasMounted) return null;

  return (
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
            if (onClose) onClose();
          }}
          className="text-white hover:text-gray-300 duration-200 cursor-pointer rounded-full p-2 shadow-lg hover:bg-white/40"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      </div>
      <button
        onClick={capturePhoto}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-white/200 p-2 rounded-full text-xl shadow-lg hover:bg-blue-700 duration-200 cursor-pointer"
      >
        <div className="bg-white p-5 rounded-full shadow-lg">
          <Camera className="w-10 h-10 text-black"></Camera>
        </div>
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {capturedImage && (
        <div className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-full rounded-lg border shadow-md"
          />
          <div className="flex flex-row items-center space-x-3">
            <button
              onClick={() => {
                if (capturedImage && onSave) {
                  const file = dataURLtoFile(capturedImage, getPhotoFileName());
                  onSave(file);
                  setCapturedImage(null);
                  if (onClose) onClose();
                }
              }}
              className="mt-6 bg-[#07BC0C] text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-[#07BC0C]/70 cursor-pointer duration-200"
            >
              Save
            </button>
            <button
              onClick={() => {
                setCapturedImage(null);
                if (onClose) onClose();
              }}
              className="mt-6 bg-[#E74C3C] text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-[#E74C3C]/70 cursor-pointer duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
