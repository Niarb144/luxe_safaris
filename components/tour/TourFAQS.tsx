"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function TourFAQS({ items }: any) {
  const t = useTranslations("tourDetails");
  const [openId, setOpenId] = useState<number | null>(null);

  if (!items?.length) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {t("faqs")}
      </h2>
      <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
        {items.map((faq: any) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left group"
              >
                <span className="font-semibold text-gray-800 group-hover:text-[#b77e24] transition-colors duration-200">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`shrink-0 text-[#b77e24] transition-transform duration-300 cursor-pointer ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}