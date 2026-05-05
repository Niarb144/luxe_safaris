export default function BookingCard({ tour }: any) {
  return (
    <div className="sticky top-20 h-fit">
      <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold">
          ${tour.price}
          <span className="text-sm text-gray-400"> / person</span>
        </h2>

        <button className="w-full bg-yellow-600 py-3 rounded-xl font-semibold">
          Book Now
        </button>

        <a
          href={`https://wa.me/254XXXXXXXXX?text=I want to book ${tour.title}`}
          target="_blank"
          className="block text-center border border-gray-600 py-3 rounded-xl"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}