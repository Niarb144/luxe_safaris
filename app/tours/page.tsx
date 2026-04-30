"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import SafariCTA from "../../components/QuizButton";
import { ToursSection } from "../../components/ToursSection";

export default function ToursPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
    <section className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden">
          {/* Optimized Background Image */}
          <div className="absolute inset-0 border rounded-lg overflow-hidden">
            <Image
              src="/images/img5.jpg"
              alt="Safari landscape"
              fill
              priority
              sizes="100vw"
              className="object-cover border rounded-lg"
              placeholder="blur"
              blurDataURL="/images/img5.jpg"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
    
          {/* Content */}
          <div className="relative z-10 px-6 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              Tours
            </motion.h1>
    
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8"
            >
              <SafariCTA />
            </motion.div>
          </div>
        </section>
        <ToursSection />
    
    </>
    
  );
}