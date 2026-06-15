"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("privacyPolicy");

  // [sectionKey, itemCount]
  const listSections: [string, number][] = [
    ["informationWeCollect", 7],
    ["whyWeCollect", 5],
  ];

  return (
    <main className="max-w-5xl mx-auto py-20 px-6">

      <h1 className="text-5xl font-bold mb-8">
        {t("title")}
      </h1>

      <p className="text-gray-600 mb-12">
        {t("lastUpdated")}
      </p>

      <section className="space-y-10">

        {listSections.map(([key, count]) => (
          <div key={key}>
            <h2 className="font-bold text-2xl">
              {t(`${key}.title`)}
            </h2>

            <ul className="list-disc pl-6">
              {Array.from({ length: count }).map((_, idx) => (
                <li key={idx}>{t(`${key}.items.${idx}`)}</li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="font-bold text-2xl">
            {t("cookies.title")}
          </h2>
          <p>{t("cookies.text")}</p>
        </div>

        <div>
          <h2 className="font-bold text-2xl">
            {t("thirdParties.title")}
          </h2>
          <p>{t("thirdParties.text")}</p>
        </div>

        <div>
          <h2 className="font-bold text-2xl">
            {t("userRights.title")}
          </h2>

          <ul className="list-disc pl-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx}>{t(`userRights.items.${idx}`)}</li>
            ))}
          </ul>
        </div>

      </section>

    </main>
  );
}