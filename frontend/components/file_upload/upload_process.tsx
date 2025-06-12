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
      <div className="p-8 bg-white dark:bg-[#161C24] rounded-[12px] w-[50%]">
        <p className="text-[24px] font-bold dark:text-white">
          {fromGeneratedResult
            ? "Generating OCR Result..."
            : "Uploaded your file..."}
        </p>
        <p className="text-[18px] text-[#142544]/50 mt-2 dark:text-white">
          {fromGeneratedResult
            ? "Analyzing Khmer script from uploaded image(s)..."
            : "Processing your uploaded file..."}
        </p>
        <div className="flex flex-row justify-between mt-6">
          <p className="text-[18px] text-black font-bold dark:text-white">
            Processing image {current} of {total}
          </p>
          <p className="text-[18px] font-bold">{percent}%</p>
        </div>
        <div className="w-full mt-2">
          <Progress value={percent} className="h-4 bg-gray-200" />
        </div>
        <p className="text-[18px] text-[#142544]/50 mt-6 dark:text-white">
          Powered by CADT - Cambodian Academy of Digital Technology
        </p>
      </div>
    </div>
  );
}
