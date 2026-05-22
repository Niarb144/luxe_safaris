"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import SafariCTA from "@/components/QuizButton";

export default function SafariHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="
    relative h-[60vh]
    w-full flex
    items-center
    justify-center
    text-center
    overflow-hidden">

      <div className="
      absolute inset-0
      border rounded-lg
      overflow-hidden">

        <Image
          src="/images/img5.jpg"
          alt="Safari landscape"
          fill
          priority
          sizes="100vw"
          className="
          object-cover
          border rounded-lg"
          placeholder="blur"
          blurDataURL="/images/img5.jpg"
        />

        <div className="
        absolute inset-0
        bg-black/50" />

      </div>


      <div className="
      relative z-10
      px-6 max-w-3xl">

        <motion.h1
          initial={{
            opacity:0,
            y:40
          }}
          animate={
            loaded
            ? {opacity:1,y:0}
            : {}
          }
          transition={{
            duration:0.7
          }}
          className="
          text-4xl
          md:text-6xl
          font-bold
          text-white">

          Tours

        </motion.h1>


        <motion.div
          initial={{
            opacity:0,
            y:20
          }}
          animate={
            loaded
            ? {opacity:1,y:0}
            : {}
          }
          transition={{
            delay:0.3
          }}
          className="mt-8">

          <SafariCTA />

        </motion.div>

      </div>

    </section>
  );
}