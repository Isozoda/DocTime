import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";
import { routing } from "@/navigation";
import type { Metadata } from "next";
import { AuthHydrate } from "./AuthHydrate";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: { default: "EasyDoc TJ", template: "%s | EasyDoc TJ" },
  description: "A Doctor in One Click — Book doctors across Tajikistan",
};

type Locale = "tj" | "ru" | "en";

async function loadMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch {
    return (await import("../../messages/en.json")).default;
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await loadMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange={false}>
        <div className="relative min-h-screen noise-overlay">
          <div className="fixed inset-0 mesh-bg pointer-events-none" aria-hidden />
          <div className="relative z-10">
            <AuthHydrate />
            {children}
            <Toaster richColors position="top-right" />
          </div>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
