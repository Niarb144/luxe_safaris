"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function CountryCards() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("countryCards");

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true);

      const { data, error } = await supabase
        .from("country_cards")
        .select("id, name, slug, tours, image")
        .order("tours", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      let result = data || [];

      if (locale !== "en") {
        const ids = result.map((c) => c.id);

        const { data: translationRows } = await supabase
          .from("translations")
          .select("record_id, translated_text")
          .eq("table_name", "countries")
          .eq("field", "name")
          .eq("locale", locale)
          .in("record_id", ids);

        if (translationRows?.length) {
          const translationMap = Object.fromEntries(
            translationRows.map((row) => [row.record_id, row.translated_text])
          );

          result = result.map((c) => ({
            ...c,
            name: translationMap[c.id] ?? c.name,
          }));
        }
      }

      setCountries(result);
      setLoading(false);
    }

    fetchCountries();
  }, [locale]);

  if (loading)
    return <div className="py-20 text-center">{t("loading")}</div>;

  return (
    <section className="w-full py-16 bg-[#faf6f1]">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/tours?country=${country.slug}`}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <div className="relative h-[300px] w-full">
                  {country.image ? (
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-semibold">
                    {country.name}
                  </h3>

                  <div className="mt-2 inline-block bg-[#b77e24] px-4 py-1 rounded-full text-sm">
                    {t(country.tours !== 1 ? "tours" : "tour", { count: country.tours })}
                  </div>
                </div>

              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}