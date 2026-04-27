"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type CountryTour = {
  id: string;
  name: string;
  image: string;
  tours: number;
};

type Props = {
  data: CountryTour[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export default function CountryCards({ data }: Props) {
  return (
    <section className="w-full py-16 bg-[#faf6f1]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="tracking-widest text-sm text-gray-500 uppercase">
            Explore East Africa
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-800 mt-2">
            Extraordinary tours across East Africa
          </h2>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden"
        >
          {data.map((country) => (
            <motion.div
              key={country.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -6,
                transition: { duration: 0.2 },
              }}
              className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            >
              {/* Image */}
              <div className="relative h-[420px] w-full">
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 w-full p-5 text-white">
                <h3 className="text-2xl font-semibold">{country.name}</h3>

                <div className="mt-3 inline-flex items-center px-4 py-1 rounded-full bg-orange-500 text-sm font-medium">
                  {country.tours} TOURS
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}