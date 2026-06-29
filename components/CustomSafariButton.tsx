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
        "fixed bottom-6 left-6 z-50",
        "inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full",
        "bg-[#B98A3E] text-white text-[13px] font-semibold uppercase tracking-wide",
        "shadow-[0_4px_20px_rgba(185,138,62,0.4)]",
        "hover:bg-[#a87c35] hover:shadow-[0_6px_28px_rgba(185,138,62,0.55)] hover:-translate-y-0.5",
        "active:translate-y-0 transition-all duration-200",
      ].join(" ")}
    >
      <ArrowRight className="w-4 h-4" />
      {t("link")}
    </Link>
  );
}