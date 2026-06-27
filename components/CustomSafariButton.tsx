// components/CustomSafariButton.tsx
"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CustomSafariButton() {
  return (
    <Link
      href="/custom-safari"
      className={[
        "inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full",
        "bg-[#B98A3E] text-white text-[13px] font-semibold uppercase tracking-wide",
        "shadow-[0_2px_12px_rgba(185,138,62,0.3)]",
        "hover:bg-[#a87c35] hover:shadow-[0_4px_20px_rgba(185,138,62,0.45)] hover:-translate-y-px",
        "active:translate-y-0 transition-all duration-200",
      ].join(" ")}
    >
      <ArrowRight className="w-4 h-4" />
      Plan my safari
    </Link>
  );
}