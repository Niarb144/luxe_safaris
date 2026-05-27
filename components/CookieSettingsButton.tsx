"use client";

import { useCookieConsent } from "@/context/CookieConsentContext";

/**
 * Drop this anywhere in your layout so users can re-open cookie settings
 * after they've already consented — e.g. in your footer.
 */
export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  const { resetConsent } = useCookieConsent();

  return (
    <button
      onClick={resetConsent}
      className={
        className ??
        "text-xs text-stone-500 underline underline-offset-2 hover:text-stone-700 transition-colors"
      }
    >
      Cookie settings
    </button>
  );
}
