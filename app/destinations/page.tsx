import { Suspense } from "react";
import DestinationsHero from "@/components/DestinationsHero";
import Destinations from "@/components/Destinations";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    country?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="bg-white">
      <DestinationsHero />
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[32px] h-[400px] bg-gray-100 animate-pulse" />
          ))}
        </div>
      }>
        <Destinations searchParams={params} />
      </Suspense>

      <WhyChooseLuxeSafaris />
    </div>
  );
}