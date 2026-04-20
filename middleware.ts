// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { languages, defaultLanguage } from "./lib/i18n";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip static files
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if URL already has language
  const hasLang = languages.some((lang) =>
    pathname.startsWith(`/${lang}`)
  );

  if (!hasLang) {
    return NextResponse.redirect(
      new URL(`/${defaultLanguage}${pathname}`, req.url)
    );
  }
}