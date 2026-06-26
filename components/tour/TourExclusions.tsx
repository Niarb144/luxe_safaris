"use client";

import { useTranslations } from "next-intl";

export default function TourExclusions({ items }: any) {
  const t = useTranslations("tourDetails");

  if (!items?.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-[2px] border-[#EB3434] bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EB3434]">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EB3434] text-[#F5F5F5]">
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
        <h2 className="text-base font-semibold tracking-wide text-[#14201A]">
          {t("whatsExcluded")}
        </h2>
      </div>

      {/* Items */}
      <ul className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((item: any) => (
          <li
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 border-b border-r border-[#EB3434] group transition-colors hover:bg-[#EB3434]"
          >
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-[#EB3434] bg-[#EB3434] hover:bg-[#EB3434]/70 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-2.5 h-2.5 text-[#F5F5F5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
            <span className="text-sm text-[#080707] leading-snug group-hover:text-[#F5F5F5] transition-colors">
              {item.item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}