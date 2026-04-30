"use client";

import { useLocale, usePathname, useRouter } from "@/lib/locale-nav";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

const LANGUAGES = [
  { code: "tj", label: "TJ", full: "Тоҷикӣ" },
  { code: "ru", label: "RU", full: "Русский" },
  { code: "en", label: "EN", full: "English" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const current = LANGUAGES.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Globe className="h-4 w-4" />
          <span>{current?.label ?? "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => router.replace(pathname, { locale: lang.code })}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            <span className="font-medium w-8">{lang.label}</span>
            <span className="text-muted-foreground">{lang.full}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
