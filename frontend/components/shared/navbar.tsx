import Image from "next/image";
import ModeToggle from "../toggles/ModeToggle";
import LanguageToggle from "../toggles/LanguageToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-[20px] text-white px-[144px] bg-white dark:bg-black fixed w-full top-0 left-0 shadow-md z-10 [right:var(--removed-body-scroll-bar-size,0px)]">
      <Image src="/images/logo.png" alt="Logo" width={222.22} height={40} />
      <div className="flex space-x-4">
        <ModeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
}
