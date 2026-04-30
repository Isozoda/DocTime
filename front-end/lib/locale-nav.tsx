"use client";

import {
  useParams,
  useRouter as useNextRouter,
  usePathname as useNextPathname,
} from "next/navigation";
import NextLink from "next/link";
import type { ComponentProps } from "react";

export function useLocale(): string {
  const params = useParams();
  return (params?.locale as string) ?? "tj";
}

export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();

  return {
    push: (href: string) =>
      router.push(href.startsWith("/") ? `/${locale}${href}` : href),
    replace: (href: string, opts?: { locale?: string }) => {
      const targetLocale = opts?.locale ?? locale;
      const path = href === "/" || href === "" ? "" : href.startsWith("/") ? href : `/${href}`;
      router.replace(`/${targetLocale}${path}`);
    },
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
    prefetch: (href: string) =>
      router.prefetch(href.startsWith("/") ? `/${locale}${href}` : href),
  };
}

export function usePathname(): string {
  const pathname = useNextPathname();
  const locale = useLocale();
  return pathname.replace(new RegExp(`^/${locale}`), "") || "/";
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };

export function Link({ href, ...props }: LinkProps) {
  const locale = useLocale();
  const localHref = href.startsWith("/") ? `/${locale}${href}` : href;
  return <NextLink href={localHref} {...props} />;
}
