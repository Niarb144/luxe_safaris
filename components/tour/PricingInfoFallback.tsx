"use client";

import { useTranslations, useLocale } from "next-intl";
import enMessages from "@/messages/en.json";

export default function PricingInfoFallback() {
  const t = useTranslations("pricingInfo");
  const locale = useLocale();

  const ageBrackets = [
    {
      key: "adults",
      label: t("ageBrackets.adults.label"),
      age: t("ageBrackets.adults.age"),
      rate: t("ageBrackets.adults.rate"),
    },
    {
      key: "olderChildren",
      label: t("ageBrackets.olderChildren.label"),
      age: t("ageBrackets.olderChildren.age"),
      rate: t("ageBrackets.olderChildren.rate"),
    },
    {
      key: "youngerChildren",
      label: t("ageBrackets.youngerChildren.label"),
      age: t("ageBrackets.youngerChildren.age"),
      rate: t("ageBrackets.youngerChildren.rate"),
    },
    {
      key: "infants",
      label: t("ageBrackets.infants.label"),
      age: t("ageBrackets.infants.age"),
      rate: t("ageBrackets.infants.rate"),
    },
  ];

  // Raw structured array pulled directly from en.json — see note below
  const rawRows = t.raw("comparison.rows");
  const comparisonRows: { factor: string; privateSafari: string; sharedSafari: string }[] =
    Array.isArray(rawRows)
      ? rawRows
      : rawRows && typeof rawRows === "object"
      ? Object.keys(rawRows)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => rawRows[key])
      : (enMessages.pricingInfo.comparison.rows as { factor: string; privateSafari: string; sharedSafari: string }[]);

  return (
    <div className="space-y-10">
      {/* Age-based pricing explanation */}
      <div>
        <h3 className="font-heading text-xl md:text-2xl font-bold text-[#14201A] mb-2">
          {t("title")}
        </h3>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          {t("description")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ageBrackets.map((bracket) => (
            <div
              key={bracket.key}
              className="border border-[#B98A3E]/30 rounded-lg p-4 text-center bg-white"
            >
              <p className="text-xs uppercase tracking-wide text-[#B98A3E] font-medium mb-1">
                {bracket.label}
              </p>
              <p className="text-sm font-semibold text-[#14201A]">{bracket.age}</p>
              <p className="text-xs text-gray-500 mt-1">{bracket.rate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Private vs Shared comparison table */}
      <div>
        <h3 className="font-heading text-xl md:text-2xl font-bold text-[#14201A] mb-2">
          {t("comparison.title")}
        </h3>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          {t("comparison.description")}
        </p>

        <div className="overflow-x-auto border border-[#B98A3E]/30 rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#14201A] text-white">
                <th className="px-4 py-3 font-medium">{t("comparison.tableHeaders.factor")}</th>
                <th className="px-4 py-3 font-medium">{t("comparison.tableHeaders.privateSafari")}</th>
                <th className="px-4 py-3 font-medium">{t("comparison.tableHeaders.sharedSafari")}</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.factor}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#F2EDE3]/40"}
                >
                  <td className="px-4 py-3 font-medium text-[#14201A] align-top whitespace-nowrap">
                    {row.factor}
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-top">{row.privateSafari}</td>
                  <td className="px-4 py-3 text-gray-700 align-top">{row.sharedSafari}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}