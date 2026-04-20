import { getTours } from "@/lib/api";

export default async function SafarisPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params; // ✅ unwrap first

  const tours = await getTours(lang);

  return (
    <div>
      <h1>Safaris</h1>

      {tours.map((tour: any) => (
        <div key={tour.id}>
          <h2>{tour.title}</h2>
          <p>{tour.description}</p>
        </div>
      ))}
    </div>
  );
}