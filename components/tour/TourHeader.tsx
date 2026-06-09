import { T } from "../T";

export default function TourHeader({ tour }: any) {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        <T text={tour.title} />
      </h1>
      <p className="text-gray-600 mt-2">
        <T text={tour.description} />
      </p>
    </div>
  );
}