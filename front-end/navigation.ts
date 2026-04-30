import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tj", "ru", "en"] as const,
  defaultLocale: "tj",
});

// Use Next.js-native implementations to avoid server-side getLocale() calls
// that require next-intl config file (not compatible with Next.js 16 Turbopack plugin)
export { Link, useRouter, usePathname } from "@/lib/locale-nav";
