"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroLoader() {
const text = "Luxe Plains Africa Safaris";

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/logo.jpeg"
            alt="Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
        </motion.div>

        {/* Site Name */}
        {text.split("").map((char, i) => (
        <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
        >
            {char}
        </motion.span>
        ))}
      </div>
    </motion.div>
  );
}