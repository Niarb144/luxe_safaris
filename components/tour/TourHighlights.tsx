export default function TourHighlights({ items }: any) {
    if (!items?.length) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Tour Highlights</h2>
            <ul className="list-disc list-inside text-gray-400">
                {items.map((highlight: any) => (
                    <li key={highlight.id} className="mb-2">
                        {highlight.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}   