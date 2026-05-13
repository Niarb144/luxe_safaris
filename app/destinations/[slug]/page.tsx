import { supabase } from "@/lib/supabase";

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

  const destinationId = destination.id;

  const { data: facts } = await supabase
    .from("destination_facts")
    .select("*")
    .eq("destination_id", destinationId);

  const { data: highlight } = await supabase
    .from("destination_highlights")
    .select("*")
    .eq("destination_id", destinationId);

  const { data: images } = await supabase
    .from("destination_images")
    .select("*")
    .eq("destination_id", destinationId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}
      <div className="relative h-[520px] overflow-hidden">
        <img
          src={images?.[0]?.image_url}
          className="w-full h-full object-cover"
        />

        {/* soft gradient instead of dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        <div className="absolute bottom-0 p-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            {destination.name}
          </h1>
          <p className="text-white/90 text-xl mt-2">
            {destination.country}
          </p>
        </div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* DESCRIPTION */}
        <section className="bg-white rounded-3xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold mb-4">
            About this destination
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {destination.description}
          </p>
        </section>

        {/* HIGHLIGHTS */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            Highlights
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {highlight?.map((item: any) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700 font-medium">
                  {item.highlight}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FACTS */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            Quick Facts
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {facts?.map((fact: any) => (
              <div
                key={fact.id}
                className="bg-white border rounded-2xl p-5 flex items-start gap-3 shadow-sm"
              >
                <span className="text-green-600 font-bold">•</span>
                <p className="text-gray-700">{fact.fact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MAP */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            Location
          </h2>

          <div className="rounded-3xl overflow-hidden border shadow-sm">
            <iframe
              src={destination.map_url}
              className="w-full h-[450px]"
              loading="lazy"
            />
          </div>
        </section>

      </div>
    </div>
  );
}