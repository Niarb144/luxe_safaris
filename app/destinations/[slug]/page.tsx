import { supabase } from "@/lib/supabase";
import WhyChooseLuxeSafaris from "@/components/WhyChooseUs";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: destination } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!destination) return null;

  const { data, error } = await supabase
  .from("tour_destinations")
  .select(`
    tours (
      id,
      title,
      slug,
      price
    )
  `)
  .eq("destination_id", destination.id);

if (error) {
  console.error(error);
}

const relatedTours = data?.map((item) => item.tours);

console.log("Related Tours:", relatedTours); 

  const destinationId = destination.id;

  const { data: facts } = await supabase
    .from("destination_facts")
    .select("*")
    .eq("destination_id", destinationId);

  const { data: highlights } = await supabase
    .from("destination_highlights")
    .select("*")
    .eq("destination_id", destinationId);

  const { data: images } = await supabase
    .from("destination_images")
    .select("*")
    .eq("destination_id", destinationId);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900">
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[620px] overflow-hidden">
        <img
          src={
            images?.[0]?.image_url ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          }
          alt={destination.name}
          className="w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* content */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="max-w-3xl">
              {destination.country && (
                <p className="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
                  {destination.country}
                </p>
              )}

              {destination.name && (
                <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight">
                  {destination.name}
                </h1>
              )}

              {destination.description && (
                <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-2xl">
                  {destination.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* GALLERY */}
        {images && images.length > 1 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {images.slice(1).map((image: any) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-[28px] h-[320px] group"
              >
                <img
                  src={image.image_url}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
            ))}
          </section>
        )}

        {/* HIGHLIGHTS */}
        {highlights && highlights.length > 0 && (
          <section className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                Experience
              </p>

              <h2 className="text-4xl font-semibold leading-tight">
                Destination Highlights
              </h2>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
              {highlights.map((item: any, index: number) => (
                <div key={item.id} className="space-y-4">
                  <span className="text-4xl text-gray-300 font-light">
                    0{index + 1}
                  </span>

                  <p className="text-lg leading-relaxed text-gray-700">
                    {item.highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FACTS */}
        {facts && facts.length > 0 && (
          <section className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                Information
              </p>

              <h2 className="text-4xl font-semibold">
                Quick Facts
              </h2>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {facts.map((fact: any) => (
                <div
                  key={fact.id}
                  className="flex items-start gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-black mt-3" />

                  <p className="text-gray-700 leading-relaxed text-lg">
                    {fact.fact}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MAP */}
        {destination.map_url && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                Explore
              </p>

              <h2 className="text-4xl font-semibold">
                Location
              </h2>
            </div>

            <div className="overflow-hidden rounded-[32px] shadow-xl">
              <iframe
                src={destination.map_url}
                className="w-full h-[500px]"
                loading="lazy"
              />
            </div>
          </section>
        )}

        {relatedTours && relatedTours.length > 0 && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                Safaris
              </p>

              <h2 className="text-4xl font-semibold">
                Tours in {destination.name}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
             {relatedTours?.map((tour: any) => (
              <a
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="group bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-semibold group-hover:opacity-70 transition">
                    {tour.title}
                  </h3>

                  {tour.price && (
                    <p className="text-lg font-medium">
                      From ${tour.price}
                    </p>
                  )}
                </div>
              </a>
            ))}
            </div>
          </section>
        )}
      </div>
      <WhyChooseLuxeSafaris />
    </div>
  );
}