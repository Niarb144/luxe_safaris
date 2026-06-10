import { Suspense } from "react";
import SafariHero from "@/components/SafariHero";
import ToursList from "@/components/Tours";
import AccreditationSection from "@/components/Acrreditation";

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    destination?: string;
    duration?: string;
    type?: string;
  }>;
}) {

  const params =
    await searchParams;
  return (
    <>
      <SafariHero />

      <Suspense fallback={<div>Loading tours...</div>}>
        <ToursList searchParams={params} />
      </Suspense>

      <AccreditationSection />
    </>
  );
}