import { Suspense } from "react";
import SafariHero from "@/components/SafariHero";
import ToursList from "@/components/Tours";

export default function ToursPage() {
  return (
    <>
      <SafariHero />

      <Suspense fallback={<div>Loading tours...</div>}>
        <ToursList />
      </Suspense>
    </>
  );
}