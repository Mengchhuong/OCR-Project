import "./globals.css";
import { geistSans, geistMono, Niradei } from "./fonts/fonts";
import ThemeProviderWrapper from "./ThemeProviderWrapper";
import { LanguageProvider } from "@/context/LanguageContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Niradei.className} antialiased`}
      >
        <ThemeProviderWrapper>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
