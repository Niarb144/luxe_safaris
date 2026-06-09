"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { T } from "./T";

const reviews = [
  {
    id: 1,
    name: "Emily Carter",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    review:
      "Luxe Safaris gave us the most unforgettable African adventure. Everything from the lodges to the game drives was perfectly organized.",
  },
  {
    id: 2,
    name: "David Mwangi",
    country: "Kenya",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    review:
      "The customer service was exceptional. The safari experience felt luxurious, personal, and authentic from start to finish.",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    rating: 5,
    review:
      "Seeing the Big Five while staying in stunning camps was a dream come true. Highly recommended for luxury travel lovers.",
  },
];

export default function ReviewsSection() {
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
            <T text="Guest Experiences" />
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            <T text="Stories From Our Travelers" />
          </h2>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            <T text="Discover why travelers from around the world trust Luxe Safaris for unforgettable African adventures." />
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
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
                  <Star
                    key={i}
                    size={18}
                    className="fill-[#b77e24] text-[#b77e24]"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-300 leading-relaxed mb-8">
                <T text={`“${review.review}”`} />
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
                    <T text={review.name} />
                  </h4>
                  <p className="text-gray-400 text-sm">
                    <T text={review.country} />
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