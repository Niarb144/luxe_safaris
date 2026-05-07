export default function TourItinerary({ items }: any) {
  if (!items?.length) return null;

  const sorted = [...items].sort((a, b) => a.day - b.day);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Itinerary</h2>

      <div className="space-y-6">
        {sorted.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center font-bold">
              {item.day}
            </div>
            
            <div>
              <p className="font-semibold">Day {item.day_number}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">{item.start_time} - {item.end_time}</span>
              </div>
              <p className="text-gray-800 font-medium">{item.title}</p>
              <p className="text-gray-800">{item.description}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}