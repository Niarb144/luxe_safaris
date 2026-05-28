"use client";

import { useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import Image from "next/image";

export default function IntroLoader() {
  const text = "Luxe Plains Africa Safaris";
  const words = text.split(" ");

  const [logoScope, animateLogo] = useAnimate();
  const [glowScope, animateGlow] = useAnimate();

  useEffect(() => {
    const sequence = async () => {
      // Logo: fade in + expand with overshoot
      await animateLogo(logoScope.current, { scale: 1.15, opacity: 1 }, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
      // Settle back
      await animateLogo(logoScope.current, { scale: 1 }, { duration: 0.35, ease: "easeOut" });
      // Pulse loop
      animateLogo(
        logoScope.current,
        { scale: [1, 1.06, 1] },
        { duration: 1.6, ease: "easeInOut", repeat: Infinity }
      );
    };
    sequence();
  }, [animateLogo, logoScope]);

  useEffect(() => {
    const sequence = async () => {
      await animateGlow(glowScope.current, { opacity: 0 }, { duration: 0 });
      animateGlow(
        glowScope.current,
        { opacity: [0, 0.35, 0.15], scale: [0.8, 1.4, 1.2] },
        { duration: 1.8, ease: "easeOut", times: [0, 0.5, 1], delay: 0.7, repeat: Infinity, repeatDelay: 0.2 }
      );
    };
    sequence();
  }, [animateGlow, glowScope]);

  const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const, delay: 1.6 },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" as const, delay: 2.6 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Vignette background */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, #1a1408 0%, #0a0a0a 70%)" }}
      />

      {/* Ambient grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Logo with glow */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Glow ring — driven by useAnimate */}
          <div
            ref={glowScope}
            className="absolute rounded-full"
            style={{
              width: 130,
              height: 130,
              background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
              opacity: 0,
            }}
          />

          {/* Logo — driven by useAnimate */}
          <div
            ref={logoScope}
            style={{ position: "relative", zIndex: 1, opacity: 0, transform: "scale(0.4)" }}
          >
            <div
              className="rounded-full overflow-hidden"
              style={{ width: 88, height: 88, boxShadow: "0 0 0 1px rgba(212,175,55,0.2)" }}
            >
              <Image
                src="/images/logo.jpeg"
                alt="Luxe Plains Africa Safaris Logo"
                width={88}
                height={88}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Name — word by word, character by character */}
        <div className="flex flex-col items-center gap-1">
          {words.map((word, wordIndex) => {
            const wordStartDelay =
              1.1 +
              words
                .slice(0, wordIndex)
                .reduce((acc, w) => acc + w.length * 0.045 + 0.12, 0);

            return (
              <div key={wordIndex} className="flex overflow-hidden">
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: wordStartDelay + charIndex * 0.045,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{
                      display: "inline-block",
                      fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif",
                      fontWeight: 300,
                      fontSize: "clamp(1.4rem, 4vw, 2rem)",
                      letterSpacing: "0.18em",
                      color: "#e8d5a0",
                      lineHeight: 1.2,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            );
          })}
        </div>

        {/* Gold divider */}
        <motion.div
          variants={dividerVariants}
          initial="hidden"
          animate="visible"
          style={{
            height: 1,
            width: 120,
            marginTop: "1.25rem",
            background: "linear-gradient(90deg, transparent, #d4af37 30%, #d4af37 70%, transparent)",
            transformOrigin: "center",
          }}
        />

        {/* Subtitle */}
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "0.6rem",
            color: "#8a7a55",
            marginTop: "0.75rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
          }}
        >
          Est. in Kenya
        </motion.p>
      </div>
    </motion.div>
  );
}