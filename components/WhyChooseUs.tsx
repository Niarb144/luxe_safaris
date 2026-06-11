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

const features = [
  {
    icon: Gem,
    title: "Luxury Experiences",
    description:
      "Enjoy handpicked lodges, premium safari camps, and unforgettable adventures designed for comfort and elegance.",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Excellence",
    description:
      "We deliver world-class safari experiences at competitive prices without compromising quality or comfort.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description:
      "From arrival to departure, our team supports every traveler with dedicated attention and seamless service.",
  },
  {
    icon: Globe2,
    title: "Authentic African Adventures",
    description:
      "Experience breathtaking wildlife, rich cultures, and iconic destinations curated by local safari experts.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    description:
      "Travel confidently with secure bookings, trusted safari partners, and reliable customer support.",
  },
  {
    icon: Users,
    title: "For Every Traveler",
    description:
      "Whether solo, couples, families, or groups, we create safari journeys tailored to every travel style.",
  },
];

export default function WhyChooseLuxeSafaris() {
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
            Why Travel With Us
          </p>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Why Choose Luxe Safaris
          </h2>

          <p className="text-gray-400 text-lg mt-6 leading-relaxed">
            We combine luxury, affordability, and personalized care to create
            unforgettable safari experiences for every traveler exploring Africa.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
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
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
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
                Start Your African Adventure
              </h3>

              <p className="text-gray-400 mt-2">
                Discover luxury safari experiences crafted with care,
                authenticity, and exceptional value.
              </p>
            </div>
            <Link className="bg-[#d4af37] hover:bg-[#c39f2e] text-black font-bold px-8 py-4 rounded-2xl transition duration-300 shadow-lg" href="/tours">
              Explore Tours
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}