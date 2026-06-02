export default function TourInclusions({ items }: any) {
  if (!items?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">What’s included</h2>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <li key={item.id} className="bg-[#041f0e] p-3 rounded-lg text-white">
            ✓ {item.item}
          </li>
        ))}
      </ul>
    </div>
  );
}