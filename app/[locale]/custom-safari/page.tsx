import { getTranslations } from "next-intl/server";
import SafariInquiryForm from "@/components/SafariInquiryForm";

export async function generateMetadata() {
  const t = await getTranslations("customSafariPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function CustomSafariPage() {
  const t = await getTranslations("customSafariPage");

  return (
    <main
      className="min-h-screen bg-white"
      style={{
        backgroundImage: "linear-gradient(to bottom, #14201A 0%, #ffffff 20vh)",
      }}
    >
      {/* Hero strip */}
      <div className="border-b border-[#e8e2d9] py-30 px-6 text-center">
        {/* <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B98A3E] mb-0">
          {t("hero.eyebrow")}
        </p> */}
        <h1 className="text-4xl md:text-5xl text-[#14201A] leading-tight mb-4">
          {t("hero.heading")}
        </h1>
        <p className="text-[#6b7a6e] text-sm max-w-md mx-auto leading-relaxed">
          {t("hero.subheading")}
        </p>
      </div>

      {/* Form */}
      <div className="px-4 py-6 md:py-6">
        <SafariInquiryForm />
      </div>
    </main>
  );
}