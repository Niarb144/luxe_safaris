"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TARGET = "LOADING";

export default function IntroLoader() {
  const [display, setDisplay] = useState(TARGET);
  const iterationRef = useRef(0);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const scramble = () => {
      if (cancelled) return;

      const resolved = Math.floor(iterationRef.current);
      const text = TARGET.split("").map((ch, i) => {
        if (i < resolved) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      setDisplay(text);
      frameRef.current++;

      if (frameRef.current % 2 === 0 && iterationRef.current < TARGET.length) {
        iterationRef.current += 0.5;
      }

      if (iterationRef.current >= TARGET.length) {
        setDisplay(TARGET);
        const t = setTimeout(() => {
          if (cancelled) return;
          iterationRef.current = 0;
          frameRef.current = 0;
          rafRef.current = requestAnimationFrame(scramble);
        }, 900);
        return () => clearTimeout(t);
      }

      rafRef.current = requestAnimationFrame(scramble);
    };

    const t = setTimeout(() => {
      rafRef.current = requestAnimationFrame(scramble);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0d0b07" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');

        @keyframes dot-fade {
          0%, 100% { opacity: 0; }
          50%       { opacity: 1; }
        }
        .loader-dot {
          opacity: 0;
          display: inline-block;
        }
        .loader-dot-1 { animation: dot-fade 1.2s ease-in-out 0.0s infinite; }
        .loader-dot-2 { animation: dot-fade 1.2s ease-in-out 0.4s infinite; }
        .loader-dot-3 { animation: dot-fade 1.2s ease-in-out 0.8s infinite; }
      `}</style>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-9 py-7">
        {/* Logo — top left */}
        <div
          className="rounded-full overflow-hidden flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            border: "1px solid #3a2e18",
          }}
        >
          <Image
            src="/images/logo.jpeg"
            alt="Luxe Plains Africa Safaris"
            width={44}
            height={44}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Site name — top right */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "0.7rem",
            color: "#8a7a55",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Luxe Plains Africa Safaris
        </span>
      </div>

      {/* Centre — scramble word + dots */}
      <div className="flex items-baseline">
        <span
          style={{
            fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(2.8rem, 8vw, 3.5rem)",
            color: "#d4af37",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            minWidth: "6ch",
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {display}
        </span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(2.8rem, 8vw, 3.5rem)",
            color: "#d4af37",
            letterSpacing: "0.05em",
            marginLeft: "4px",
            lineHeight: 1,
          }}
        >
          <span className="loader-dot loader-dot-1">.</span>
          <span className="loader-dot loader-dot-2">.</span>
          <span className="loader-dot loader-dot-3">.</span>
        </span>
      </div>
    </motion.div>
  );
}