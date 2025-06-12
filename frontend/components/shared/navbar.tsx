import Image from "next/image";
import ModeToggle from "../toggles/ModeToggle";
import LanguageToggle from "../toggles/LanguageToggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <nav className="flex items-center justify-between py-[20px] text-white px-[144px] bg-white dark:bg-[#161C24] fixed w-full top-0 left-0 shadow-md z-10 [right:var(--removed-body-scroll-bar-size,0px)]">
      <Image
        className="cursor-pointer"
        src={
          theme === "dark" ? "/images/logo_light.png" : "/images/logo_dark.png"
        }
        alt="Logo"
        width={222.22}
        height={40}
        onClick={() => {
          window.location.reload();
        }}
      />
      <div className="flex space-x-4">
        <ModeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
}
