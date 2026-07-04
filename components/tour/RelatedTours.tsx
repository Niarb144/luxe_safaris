"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const FALLBACK_TOUR_IMAGE = "/images/img4.jpg";

export default function RelatedTours({ tours }: any) {
  const t = useTranslations("relatedTours");

  if (!tours?.length) return null;

  return (
    <section className="py-24 bg-[#faf7f2]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#b77e24] uppercase tracking-[0.3em] text-sm font-medium">
            {t("tagline")}
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-3">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((tour: any, index: number) => {
            const mainImage =
              tour?.tour_images?.find((img: any) => img.is_main === true)
                ?.image_url || FALLBACK_TOUR_IMAGE;

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/tours/${tour.slug || tour.id}`}
                  className="group relative block overflow-hidden rounded-[28px] h-[380px] shadow-sm hover:shadow-xl transition duration-300"
                >
                  <Image
                    src={mainImage}
                    alt={tour.title || ""}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="relative h-full flex flex-col justify-end p-6 space-y-2">
                    {tour.tagline && (
                      <p className="text-sm uppercase tracking-widest text-white/70">
                        {tour.tagline}
                      </p>
                    )}

                    <h3 className="text-2xl font-semibold text-white group-hover:opacity-90 transition">
                      {tour.title}
                    </h3>

                    {tour.price ? (
                      <p className="text-lg font-medium text-white/90">
                        {t("from")} ${tour.price}
                      </p>
                    ) : (
                      <p className="text-lg font-medium text-[#e8c98a]">
                        {t("getQuote")}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}