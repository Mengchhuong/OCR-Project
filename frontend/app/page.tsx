import LanguageToggle from "@/components/toggles/LanguageToggle";
import ModeToggle from "@/components/toggles/ModeToggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-row items-center justify-center bg-background">
      <ModeToggle />
      <LanguageToggle />
    </div>
  );
}
