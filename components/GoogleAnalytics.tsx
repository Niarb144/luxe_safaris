"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

export default function GoogleAnalytics() {
  const { consent } = useConsent();

  if (!consent?.analytics) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag(){
            dataLayer.push(arguments);
          }

          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}