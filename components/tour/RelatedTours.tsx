"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";


export default function RelatedTours({ tours }: any) {
  if (!tours?.length) return null;

  return (
    <section className="py-24 bg-[#faf7f2]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#b77e24] uppercase tracking-[0.3em] text-sm font-medium">
            Explore More
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-3">
            Related Tours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((tour: any, index: number) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/tours/${tour.slug || tour.id}`}
                className="group block overflow-hidden rounded-[28px] bg-white shadow-lg"
              >
                <div className="relative h-[260px] overflow-hidden">
                  <Image
                    src={
                      tour?.tour_images?.[0]?.image_url ||
                      "/placeholder.jpg"
                    }
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-5 left-5 text-white">
                    <p className="text-sm uppercase tracking-widest opacity-80">
                      {tour.location}
                    </p>

                    <h3 className="text-2xl font-semibold mt-1">
                      {tour.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}