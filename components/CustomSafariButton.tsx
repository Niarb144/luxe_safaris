"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export default function CustomSafariButton() {
  const t = useTranslations("customSafariButton");

  return (
    <Link
      href="/custom-safari"
      className={[
        "fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50",
        "inline-flex items-center gap-1.5 sm:gap-2.5",
        "px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full",
        "max-w-[min(80vw,220px)] sm:max-w-none w-fit",
        "bg-[#B98A3E] text-white text-[11px] sm:text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap",
        "shadow-[0_4px_20px_rgba(185,138,62,0.4)]",
        "hover:bg-[#a87c35] hover:shadow-[0_6px_28px_rgba(185,138,62,0.55)] hover:-translate-y-0.5",
        "active:translate-y-0 transition-all duration-200",
      ].join(" ")}
    >
      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
      <span className="truncate">{t("link")}</span>
    </Link>
  );
}