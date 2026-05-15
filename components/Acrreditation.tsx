"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "Tripadvisor",
    image:
      "/images/tripadvisor.png",
  },
  {
    name: "East African Wildlife Society",
    image:
      "/images/eawls.png",
  },
  {
    name: "Tourism Regualtory Authority of Kenya",
    image:
      "/images/Logo-TRA.png",
  },
  {
    name: "Trust Pilot",
    image:
      "/images/trustpilot.png",
  },
  {
    name: "Safari Bookings",
    image:
      "/images/safaribookings.png",
  }
];

export default function AccreditationSection() {
  return (
    <section className="bg-[#f5f3ee] py-24 w-full">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-wide text-[#1f2d1f] uppercase">
            Our Accreditations & Booking Security
          </h2>

          <div className="flex items-center justify-center mt-6">
            <div className="w-14 h-[3px] bg-[#d4af37]" />
            <div className="w-36 h-[3px] bg-[#1f5b43]" />
            <div className="w-14 h-[3px] bg-[#d4af37]" />
          </div>
        </motion.div>

        {/* Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="h-[240px] flex items-center justify-center p-10 bg-white">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="max-h-28 object-contain grayscale group-hover:grayscale-0 transition duration-500"
                />
              </div>

              {/* Bottom Accent */}
              <div className="h-2 bg-gradient-to-r from-[#95b82d] via-[#d4af37] to-[#95b82d]" />
            </motion.div>
          ))}
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Secure Payments
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
            <span className="text-sm font-medium text-gray-700">
              Verified Safari Operator
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <div className="w-3 h-3 rounded-full bg-[#1f5b43]" />
            <span className="text-sm font-medium text-gray-700">
              Trusted Worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}