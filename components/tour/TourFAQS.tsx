import { T } from "../T";

export default function TourFAQS({ items }: any) {
  if (!items?.length) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        <T text="FAQs" />
      </h2>
      {items.map((faq: any) => (
        <div key={faq.id} className="mb-4">
          <h3 className="font-bold text-gray-800">
            <T text={faq.question} />
          </h3>
          <p className="text-gray-600">
            <T text={faq.answer} />
          </p>
        </div>
      ))}
    </div>
  );
}