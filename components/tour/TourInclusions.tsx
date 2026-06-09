import { T } from "../T";

export default function TourInclusions({ items }: any) {
  if (!items?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">
        <T text="What’s included" />
      </h2>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <li key={item.id} className="bg-[#041f0e] p-3 rounded-lg text-white">
            ✓ <T text={item.item} />
          </li>
        ))}
      </ul>
    </div>
  );
}