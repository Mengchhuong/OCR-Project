import Navbar from "@/components/shared/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="bg-[#142544]  font-bold flex flex-col items-center justify-center text-center h-full space-y-3 text-white pt-[30px] pb-[90px]">
        <p className={`text-[34px]`}>ការប្រែក្លាយឯកសារខ្មែរទៅជាឌីជីថល</p>
        <p className={`text-[34px]`}>
          Automating the Digitization of Khmer Documents
        </p>
        <p className={`text-[22px]`}>
          Upload your Khmer document and get instant text extraction
        </p>
        <div className="w-full absolute top-[295px] px-[144px]">
          <div className="bg-white rounded-[12px] shadow-lg p-6 space-y-4">
            <div className=" border-1 border-black rounded-[12px] py-[24px] border-dotted flex flex-col items-center justify-center space-y-3">
              <Image src="/icons/Image.svg" alt="Logo" width={48} height={48} />
              <p className="text-[16px] text-[#142544] ml-4 font-normal">
                Drag and drop your file here, or click to browse <br />
                Supported formats: JPG, PNG, PDF | Max size: 10MB
              </p>
              <div className="flex space-x-4 mt-4">
                <Button variant="default">Upload</Button>
                <Button variant="default">Scan</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
