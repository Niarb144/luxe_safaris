export default function TourExclusions({ items }: any) {
  if (!items?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">What’s excluded</h2>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <li key={item.id} className="bg-[#b77e24] p-3 rounded-lg text-white">
            ✗ {item.item}
          </li>
        ))}
      </ul>
    </div>
  );
}