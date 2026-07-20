"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import {
  FaUserShield,
  FaBullseye,
  FaCookieBite,
  FaHandshake,
  FaUserCheck,
  FaList,
} from "react-icons/fa";

const ACCENT = "#B98A3E";

const tocSections = [
  "informationWeCollect",
  "whyWeCollect",
  "cookies",
  "thirdParties",
  "userRights",
];

// icon + key + item count (null = plain text section) — content comes from en.json
const sections: [string, ReactElement, number | null][] = [
  ["informationWeCollect", <FaUserShield />, 7],
  ["whyWeCollect", <FaBullseye />, 5],
  ["cookies", <FaCookieBite />, null],
  ["thirdParties", <FaHandshake />, null],
  ["userRights", <FaUserCheck />, 4],
];

export default function PrivacyPolicy() {
  const t = useTranslations("privacyPolicy");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-neutral-50 min-h-screen">

      {/* HERO */}
      <section className="relative h-[60vh] bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/images/img1.webp')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 text-center max-w-4xl px-6 py-12">
          <h1 className="text-5xl mb-4">
            {t("titlePrefix", { defaultValue: "Privacy" })}{" "}
            {t("titleAccent", { defaultValue: "Policy" })}
          </h1>

          <p className="text-lg text-gray-200">
            {t("lastUpdated")}
          </p>
        </div>
      </section>

      {/* INTRO / TABLE OF CONTENTS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow p-8 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <FaList className="text-xl" style={{ color: ACCENT }} />
            <h2 className="text-2xl font-bold text-gray-800">
              {t("contentsLabel", { defaultValue: "Contents" })}
            </h2>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tocSections.map((key, i) => (
              <li key={key}>
                <button
                  onClick={() => scrollTo(`section-${key}`)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-neutral-100 transition"
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {i + 1}
                  </span>
                  {t(`${key}.title`)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map(([key, icon, count]) => (
            <div
              key={key}
              id={`section-${key}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-7 scroll-mt-24"
            >
              <div className="text-3xl mb-4" style={{ color: ACCENT }}>
                {icon}
              </div>

              <h3 className="font-bold text-xl mb-4 text-gray-800">
                {t(`${key}.title`)}
              </h3>

              {count ? (
                <ul className="space-y-3 text-gray-600">
                  {Array.from({ length: count }).map((_, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span>•</span>
                      <span>{t(`${key}.items.${idx}`)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 leading-7">
                  {t(`${key}.text`)}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow p-8 text-center">
          <p className="text-gray-600">
            {t("footerNote", {
              defaultValue:
                "Your data is handled with care. For any privacy concerns, please contact us directly.",
            })}
          </p>
        </div>
      </section>

    </main>
  );
}