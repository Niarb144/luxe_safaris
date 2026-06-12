"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

const reviewMeta = [
  {
    id: 1,
    key: "review1",
    name: "Emily Carter",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    key: "review2",
    name: "David Mwangi",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    key: "review3",
    name: "Sophia Martinez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    rating: 5,
  },
];

export default function ReviewsSection() {
  const t = useTranslations("reviews");

  return (
    <section className="relative w-full py-24 px-6 bg-[#041f0e] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.4),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="uppercase tracking-[0.3em] text-amber-400 text-sm mb-3">
            {t("tagline")}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            {t("title")}
          </h2>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewMeta.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-[#b77e24]/40 transition-all duration-500"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-[#b77e24] text-[#b77e24]" />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-300 leading-relaxed mb-8">
                {`"${t(`items.${review.key}.text`)}"`}
              </p>

              {/* User */}
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#b77e24]/40"
                />

                <div>
                  <h4 className="text-white font-semibold text-lg">
                    {review.name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t(`items.${review.key}.country`)}
                  </p>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#b77e24]/10 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}