import Image from "next/image";
import ModeToggle from "../toggles/ModeToggle";
import LanguageToggle from "../toggles/LanguageToggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <nav className="flex items-center justify-between py-3 px-4 md:py-5 md:px-10 lg:px-36 bg-white dark:bg-[#161C24] fixed w-full top-0 left-0 shadow-md z-10 [right:var(--removed-body-scroll-bar-size,0px)]">
      <Image
        className="cursor-pointer w-[110px] h-[20px] md:w-[180px] md:h-[32px] lg:w-[222.22px] lg:h-[40px] transition-all"
        src={
          theme === "dark" ? "/images/logo_light.png" : "/images/logo_dark.png"
        }
        width={222.22}
        height={40}
        alt="Logo"
        onClick={() => {
          window.location.reload();
        }}
        priority
      />
      <div className="flex space-x-2 md:space-x-4 items-center">
        <ModeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
}
