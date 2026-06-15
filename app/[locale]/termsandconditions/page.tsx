"use client";

import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("termsPage");

  // [sectionKey, listItemCount or null for plain text]
  const sections: [string, number | null][] = [
    ["1", null],
    ["2", 3],
    ["3", 3],
    ["4", null],
    ["5", null],
    ["6", null],
    ["7", null],
    ["8", null],
    ["9", null],
    ["10", null],
    ["11", null],
    ["12", null],
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold mb-10">
        {t("title")}
      </h1>

      <p className="text-gray-600 mb-12">
        {t("lastUpdated")}
      </p>

      <section className="space-y-10">
        {sections.map(([key, itemCount]) => (
          <div key={key}>
            <h2 className="text-2xl font-bold">
              {t(`sections.${key}.title`)}
            </h2>

            {itemCount ? (
              <ul className="list-disc pl-6">
                {Array.from({ length: itemCount }).map((_, idx) => (
                  <li key={idx}>{t(`sections.${key}.items.${idx}`)}</li>
                ))}
              </ul>
            ) : (
              <p>{t(`sections.${key}.text`)}</p>
            )}
          </div>
        ))}
      </section>

    </main>
  );
}