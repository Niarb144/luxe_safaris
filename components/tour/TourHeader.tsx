export default function TourHeader({ tour }: any) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{tour.title}</h1>
      <p className="text-gray-400 mt-2">{tour.description}</p>
    </div>
  );
}