// app/[locale]/custom-safari/page.tsx

import SafariInquiryForm from "@/components/SafariInquiryForm";

export async function generateMetadata() {
  return {
    title: "Plan a Custom Safari | Luxe Plains Africa Safaris",
    description:
      "Tell us your dream safari and our specialists will craft a tailor-made itinerary just for you.",
  };
}

export default async function CustomSafariPage() {
  return (
    <main
      className="min-h-screen bg-white"
      style={{
        backgroundImage: "linear-gradient(to bottom, #14201A 0%, #ffffff 20vh)",
      }}
    >
      {/* Hero strip */}
      <div className="border-b border-[#e8e2d9] py-30 px-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B98A3E] mb-0">
          Bespoke Safaris
        </p>
        <h1 className="text-4xl md:text-5xl text-[#14201A] leading-tight mb-4">
          Design Your Safari
        </h1>
        <p className="text-[#6b7a6e] text-sm max-w-md mx-auto leading-relaxed">
          Share your travel vision and our safari specialists will craft a tailor-made
          itinerary — from intimate bush camps to exclusive lodges.
        </p>
      </div>

      {/* Form */}
      <div className="px-4 py-12 md:py-12">
        <SafariInquiryForm />
      </div>
    </main>
  );
}