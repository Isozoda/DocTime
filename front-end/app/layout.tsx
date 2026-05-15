import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "DocTime TJ — Book Top Doctors", template: "%s | DocTime TJ" },
  description: "Tajikistan's #1 healthcare platform. Book the best doctors in minutes across Dushanbe, Khujand and Bokhtar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tj" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
