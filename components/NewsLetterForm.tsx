"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations("footer.newsletter");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || status === "loading") return;

    setStatus("loading");
    setErrorKey(null);

    try {
      const recaptchaToken = executeRecaptcha
        ? await executeRecaptcha("newsletter_subscribe")
        : undefined;

      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, locale, recaptchaToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        setStatus("error");
        setErrorKey(
          data.error === "invalid_email" ? "invalidEmail" : "genericError"
        );
        return;
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Newsletter submit error:", err);
      setStatus("error");
      setErrorKey("genericError");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm font-medium bg-white/90 text-[#14201A] rounded-md px-4 py-2.5 w-full md:w-auto">
        {t("successMessage")}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full md:w-auto gap-2"
      noValidate
    >
      <div className="flex w-full md:w-auto gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          disabled={status === "loading"}
          aria-label={t("placeholder")}
          className="px-4 py-2 rounded-md text-black w-full md:w-64 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#b77e24] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#b77e24] px-5 py-2 rounded-md font-medium hover:bg-orange-300 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
        >
          {status === "loading" ? t("submitting") : t("button")}
        </button>
      </div>

      {status === "error" && errorKey && (
        <p className="text-sm text-red-100 bg-red-900/40 rounded-md px-3 py-1.5">
          {t(errorKey)}
        </p>
      )}
    </form>
  );
}