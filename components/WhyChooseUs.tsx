"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Gem,
  HeartHandshake,
  Globe2,
  BadgeDollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function WhyChooseLuxeSafaris() {
  const t = useTranslations("whyUs");

  const features = [
    { icon: Gem, key: "luxury" },
    { icon: BadgeDollarSign, key: "affordable" },
    { icon: HeartHandshake, key: "personalizedCare" },
    { icon: Globe2, key: "authentic" },
    { icon: ShieldCheck, key: "trusted" },
    { icon: Users, key: "forEveryone" },
  ];

  return (
    <section className="relative w-full py-28 bg-[#0d1510] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_35%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="uppercase tracking-[0.3em] text-[#d4af37] text-sm mb-4">
            {t("tagline")}
          </p>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {t("title")}
          </h2>

          <p className="text-gray-400 text-lg mt-6 leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-[#d4af37]/50 transition-all duration-500 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#d4af37]/10 to-transparent" />

                {/* Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mb-6">
                  <Icon className="text-[#d4af37]" size={30} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {t(`features.${feature.key}.title`)}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </div>

                {/* Decorative Number */}
                <span className="absolute bottom-6 right-6 text-6xl font-bold text-white/5">
                  0{index + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#1b2b20] to-[#111c15] border border-[#d4af37]/20 rounded-[32px] px-10 py-8 shadow-2xl">
            <div className="text-left">
              <h3 className="text-3xl font-bold text-white">
                {t("cta.title")}
              </h3>

              <p className="text-gray-400 mt-2">
                {t("cta.subtitle")}
              </p>
            </div>
            <Link
              className="bg-[#d4af37] hover:bg-[#c39f2e] text-black font-bold px-8 py-4 rounded-2xl transition duration-300 shadow-lg"
              href="/tours"
            >
              {t("cta.button")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}