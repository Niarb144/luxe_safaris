"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const phoneNumber = "25498765432"; // replace with your number
  const message = encodeURIComponent(
    "Hello! I'm interested in your safari tours. Can you assist me?"
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <>
        {show && (
            <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: .6, type: "spring", stiffness: 120 }}
      className="fixed bottom-18 right-6 z-50 group"
    >
      {/* Tooltip */}
      <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">
        Chat with us
      </div>

      {/* Button */}
      <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition">
        <FaWhatsapp size={24} />
      </div>
    </motion.a>
        )}
    </>
    
  );
}