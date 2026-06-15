"use client";

import {
  FaPassport,
  FaShieldAlt,
  FaMoneyBillWave,
  FaSyringe,
  FaWifi,
  FaCloudSun,
  FaCar,
  FaPhone,
  FaGlobeAfrica,
} from "react-icons/fa";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";
import { useTranslations } from "next-intl";

export default function PracticalInfoPage() {
  const t = useTranslations("practicalInfo");

  // icon + key + item count — text content comes from en.json
  const sections = [
    { icon: <FaPassport />, key: "visa", count: 5 },
    { icon: <FaSyringe />, key: "health", count: 4 },
    { icon: <FaMoneyBillWave />, key: "currency", count: 5 },
    { icon: <FaShieldAlt />, key: "safety", count: 4 },
    { icon: <FaCloudSun />, key: "bestTime", count: 3 },
    { icon: <FaWifi />, key: "connectivity", count: 3 },
    { icon: <FaCar />, key: "transport", count: 4 },
    { icon: <FaPhone />, key: "emergency", count: 4 },
  ];

  const borderRows = ["kenyaUganda", "kenyaTanzania", "ugandaTanzania"];

  return (
    <main className="bg-neutral-50 min-h-screen">

      {/* HERO */}
      <section className="relative h-[60vh] bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/images/img1.webp')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 text-center max-w-4xl px-6 py-12">
          <div className="flex justify-center mb-5 text-5xl">
            <FaGlobeAfrica />
          </div>

          <h1 className="text-5xl font-bold mb-4">
            {t("hero.title")}
          </h1>

          <p className="text-lg text-gray-200">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {t("intro.title")}
          </h2>

          <p className="text-gray-600 leading-8">
            {t("intro.text")}
          </p>
        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-7"
            >
              <div className="text-3xl text-green-700 mb-4">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl mb-4 text-gray-800">
                {t(`sections.${item.key}.title`)}
              </h3>

              <ul className="space-y-3 text-gray-600">
                {Array.from({ length: item.count }).map((_, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{t(`sections.${item.key}.items.${idx}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* BORDER CROSSING TABLE */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="p-8 border-b">
            <h2 className="text-3xl font-bold text-gray-800">
              {t("borderTable.title")}
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="p-4 text-left text-gray-800">{t("borderTable.headers.route")}</th>
                <th className="p-4 text-left text-gray-800">{t("borderTable.headers.visa")}</th>
                <th className="p-4 text-left text-gray-800">{t("borderTable.headers.vaccination")}</th>
                <th className="p-4 text-left text-gray-800">{t("borderTable.headers.notes")}</th>
              </tr>
            </thead>

            <tbody>
              {borderRows.map((rowKey) => (
                <tr key={rowKey} className="border-t">
                  <td className="p-4 text-gray-800">{t(`borderTable.rows.${rowKey}.route`)}</td>
                  <td className="p-4 text-gray-800">{t(`borderTable.rows.${rowKey}.visa`)}</td>
                  <td className="p-4 text-gray-800">{t(`borderTable.rows.${rowKey}.vaccination`)}</td>
                  <td className="p-4 text-gray-800">{t(`borderTable.rows.${rowKey}.notes`)}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </section>

      <WhyChooseLuxeSafaris />

    </main>
  );
}