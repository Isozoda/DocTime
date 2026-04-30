import type { Metadata } from "next";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "EasyDoc TJ", template: "%s | EasyDoc TJ" },
  description: "A Doctor in One Click — Book doctors in Tajikistan online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tj" suppressHydrationWarning>
      <body className={`${nunito.variable} ${geistMono.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
