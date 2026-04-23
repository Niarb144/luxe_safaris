"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntroLoader from "./IntroLoader";

export default function ClientLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (hasLoaded) {
        setLoading(false);
        return;
    }

    sessionStorage.setItem("hasLoaded", "true");

    const handleLoad = () => {
        setTimeout(() => setLoading(false), 500); // slight delay for animation
    };

    if (document.readyState === "complete") {
        handleLoad();
    } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }
    }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <IntroLoader />}
      </AnimatePresence>

      {/* <div className={`transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"}`}> */}
      <div className="relative z-0">
        {children}
      </div>
    </>
  );
}