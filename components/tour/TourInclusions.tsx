"use client";

import { useTranslations } from "next-intl";

export default function TourInclusions({ items }: any) {
  const t = useTranslations("tourDetails");

  if (!items?.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#052E05] border-[2px] bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#052E05]/20">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#052E05]/10 text-[#B98A3E]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h2 className="text-base font-semibold tracking-wide text-[#14201A]">
          {t("whatsIncluded")}
        </h2>
      </div>

      {/* Items */}
      <ul className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((item: any) => (
          <li
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 border-b border-r border-[#052E05]/10 group transition-colors hover:bg-[#052E05]/5"
          >
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-[#052E05]/40 bg-[#052E05]/8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-2.5 h-2.5 text-[#B98A3E]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="text-sm text-[#3a4a40] leading-snug group-hover:text-[#14201A] transition-colors">
              {item.item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}