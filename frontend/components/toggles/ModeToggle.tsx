"use client";
import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="text-black cursor-pointer hover:text-[#FF4438] dark:hover:text-[#FF4438] duration-300 relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent dark:text-white"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="h-5 w-5 sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-150 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-5 w-5 sm:h-[1.2rem] sm:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-150" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
