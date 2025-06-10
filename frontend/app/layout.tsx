import "./globals.css";
import { geistSans, geistMono, Niradei } from "./fonts/fonts";
import ThemeProviderWrapper from "./ThemeProviderWrapper";

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
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}
