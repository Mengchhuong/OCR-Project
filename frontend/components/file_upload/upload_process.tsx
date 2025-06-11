import { Progress } from "@/components/ui/progress";

export default function UploadProcess({
  current,
  total,
  percent,
  fromGeneratedResult,
}: {
  fromGeneratedResult: boolean;
  current: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="p-8 bg-white rounded-[12px] w-[50%]">
        <p className="text-[24px] font-bold dark:text-black">
          {fromGeneratedResult
            ? "Generating OCR Result..."
            : "Uploaded your file..."}
        </p>
        <p className="text-[18px] text-[#142544]/50 mt-4">
          {fromGeneratedResult
            ? "Analyzing Khmer script from uploaded image(s)..."
            : "Processing your uploaded file..."}
        </p>
        <div className="flex flex-row justify-between mt-4">
          <p className="text-[18px] text-black font-bold">
            Processing image {current} of {total}
          </p>
          <p className="text-[18px] font-bold">{percent}%</p>
        </div>
        <div className="w-full mt-4">
          <Progress value={percent} className="h-4 bg-gray-200" />
        </div>
        <p className="text-[18px] text-[#142544]/50 mt-4">
          Powered by CADT - Cambodian Academy of Digital Technology
        </p>
      </div>
    </div>
  );
}
