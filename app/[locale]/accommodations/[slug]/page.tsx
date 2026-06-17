import { supabase } from "@/lib/supabase";
import Image from "next/image";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";
import ContactCard from "@/components/ContactCard";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { applyTranslation } from "@/lib/translations";
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
  CheckIcon,
  MapIcon,
  HotelIcon,
} from "lucide-react";

export default async function AccommodationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("accommodationDetail");
  const tLevels = await getTranslations("accommodations");

  const { data, error } = await supabase
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

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto p-10 text-center text-gray-600">
        {t("notFound")}
      </div>
    );
  }

  // Translate DB content — accommodation_type, description, hotel_name, location
  // (classification is intentionally excluded — used for filter matching elsewhere)
  const accommodation = await applyTranslation(
    "accommodations",
    data,
    ["accommodation_type", "description", "hotel_name", "location", "amenities", "services"],
    locale
  );

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
    return key ? amenityIcons[key] : Sparkles;
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

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
                  {tLevels(`levels.${accommodation.classification}`)}
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
              <h2 className="text-2xl font-semibold mb-4">{t("overview")}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {accommodation.description}
              </p>
            </section>
          )}

          {/* Accommodation Type */}
          {accommodation.accommodation_type && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <HotelIcon className="w-5 h-5 text-[#0f2e1d]" />
                <h2 className="text-2xl font-semibold">{t("accommodationType")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {accommodation.accommodation_type}
              </p>
            </section>
          )}

          {/* IMAGE GALLERY */}
          {accommodation.images?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">{t("gallery")}</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.images.map((image: string, index: number) => (
                  <div key={index} className="overflow-hidden rounded-xl group">
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
              <h2 className="text-2xl font-semibold mb-6">{t("amenities")}</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.amenities.map((amenity: string) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition"
                    >
                      <Icon className="w-5 h-5 text-[#0f2e1d]" />
                      <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Services */}
          {accommodation.services?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">{t("services")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accommodation.services.map((service: string) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-sm transition"
                  >
                    <CheckIcon className="w-5 h-5 text-[#0f2e1d]" />
                    <span className="text-sm text-gray-700 capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location */}
          {accommodation.location && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <MapIcon className="w-5 h-5 text-[#0f2e1d]" />
                <h2 className="text-2xl font-semibold">{t("location")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {accommodation.location}
              </p>
            </section>
          )}

          {/* MAP */}
          {accommodation.map_url && (
            <section>
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
            <h3 className="text-lg font-semibold">{t("quickHighlights")}</h3>

            {accommodation.destinations?.name && (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{t("destination")}</span>{" "}
                {accommodation.destinations.name}
              </div>
            )}

            {accommodation.classification && (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{t("class")}</span>{" "}
                {tLevels(`levels.${accommodation.classification}`)}
              </div>
            )}

            {accommodation.amenities?.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{t("amenitiesLabel")}</span>{" "}
                {accommodation.amenities.slice(0, 4).join(", ")}...
              </div>
            )}
          </div>

          <div className="bg-[#0f2e1d] text-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              {t("sidebar.title")}
            </h3>
            <p className="text-sm text-white/80 mb-4">
              {t("sidebar.subtitle")}
            </p>
            <button className="w-full bg-[#c8a24a] hover:bg-[#b8923f] text-black font-medium py-3 rounded-xl transition">
              <Link className="inline-block mr-2" href="/contact">
                {t("sidebar.enquireNow")}
              </Link>
            </button>
          </div>
        </aside>
      </div>

      <WhyChooseLuxeSafaris />
      <ContactCard />
    </div>
  );
}