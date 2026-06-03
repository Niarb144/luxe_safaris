import { supabase } from "@/lib/supabase";
import Image from "next/image";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";
import Link from "next/link";
import {
  Wifi,
  Car,
  Utensils,
  Tv,
  Bath,
  Waves,
  Dumbbell,
  Coffee,
  Wind,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default async function AccommodationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: accommodation, error } = await supabase
    .from("accommodations")
    .select(
      `
      *,
      destinations (
        id,
        name
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !accommodation) {
    return (
      <div className="max-w-5xl mx-auto p-10 text-center text-gray-600">
        Accommodation not found
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    restaurant: Utensils,
    tv: Tv,
    bathroom: Bath,
    pool: Waves,
    gym: Dumbbell,
    bar: Coffee,
    ac: Wind,
    security: ShieldCheck,
  };

  const getAmenityIcon = (amenity: string) => {
    const key = Object.keys(amenityIcons).find((k) =>
      amenity.toLowerCase().includes(k)
    );

    return key ? amenityIcons[key] : Sparkles; // fallback icon
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900">
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[650px] overflow-hidden">
        <img
          src={
            accommodation.images?.[0] ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          }
          alt={accommodation.hotel_name}
          className="w-full h-full object-cover scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* HERO CONTENT */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="max-w-3xl space-y-4">
              {accommodation.destinations?.name && (
                <p className="uppercase tracking-[0.35em] text-white/70 text-xs">
                  {accommodation.destinations.name}
                </p>
              )}

              <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
                {accommodation.hotel_name}
              </h1>

              {accommodation.classification && (
                <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1 rounded-full text-sm">
                  {accommodation.classification}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-12">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-12">
          {/* DESCRIPTION */}
          {accommodation.description && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {accommodation.description}
              </p>
            </section>
          )}

          {/* IMAGE GALLERY */}
          {accommodation.images?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">Gallery</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl group"
                  >
                    <Image
                      src={image}
                      alt={accommodation.hotel_name}
                      width={800}
                      height={600}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AMENITIES */}
          {accommodation.amenities?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">Amenities</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.amenities.map((amenity: string) => {
                  const Icon = getAmenityIcon(amenity);

                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition"
                    >
                      <Icon className="w-5 h-5 text-[#0f2e1d]" />

                      <span className="text-sm text-gray-700 capitalize">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* MAP */}
          {accommodation.map_url && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="rounded-xl overflow-hidden shadow-sm border">
                <iframe
                  src={accommodation.map_url}
                  className="w-full h-[420px]"
                  loading="lazy"
                />
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Quick Highlights</h3>

            {accommodation.destinations?.name && (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Destination:</span>{" "}
                {accommodation.destinations.name}
              </div>
            )}

            {accommodation.classification && (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Class:</span>{" "}
                {accommodation.classification}
              </div>
            )}

            {accommodation.amenities?.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  Amenities:
                </span>{" "}
                {accommodation.amenities.slice(0, 4).join(", ")}...
              </div>
            )}
          </div>

          <div className="bg-[#0f2e1d] text-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Experience Luxury Safaris
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Let us help you plan a tailored African safari stay experience.
            </p>
            <button className="w-full bg-[#c8a24a] hover:bg-[#b8923f] text-black font-medium py-3 rounded-xl transition">
              <Link className="inline-block mr-2" href="/contact">
                Enquire Now
              </Link>
            </button>
          </div>
        </aside>
      </div>

      <WhyChooseLuxeSafaris />
    </div>
  );
}