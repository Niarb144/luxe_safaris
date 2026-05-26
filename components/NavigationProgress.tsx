"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  const start = () => {
    clearAllTimers();
    setProgress(0);
    setVisible(true);

    // Increment progress quickly at first, then slow down as it approaches 85%
    // It never reaches 100% on its own — that only happens when navigation completes
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 12;
      if (current >= 85) {
        current = 85;
        clearInterval(intervalRef.current!);
      }
      setProgress(current);
    }, 150);
  };

  const complete = () => {
    clearAllTimers();

    // Snap to 100%
    setProgress(100);

    // Fade out after the bar reaches 100%
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  // Track route changes — fires whenever pathname or search params change
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip triggering on the very first render (initial page load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    complete();
  }, [pathname, searchParams]);

  // Intercept Next.js link clicks to start the bar immediately on click,
  // before the new route has loaded
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only trigger for internal navigation links
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin);
      const isNewTab =
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey;

      if (isInternal && !isNewTab) {
        start();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none">
      {/* Track */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Progress bar */}
      <div
        className="h-full bg-[#b77e24] transition-all duration-200 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Glowing tip */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-full"
          style={{
            background:
              "linear-gradient(to right, transparent, #d4a54b88, #d4a54b)",
            filter: "blur(3px)",
          }}
        />

        {/* Bright dot at the leading edge */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d4a54b] shadow-lg"
          style={{
            boxShadow: "0 0 8px 2px #b77e2488",
            transform: "translate(50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}