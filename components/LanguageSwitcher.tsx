"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { languages } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const lang = pathname.split("/")[1];
    setCurrentLang(lang);
    setMounted(true);
  }, [pathname]);

  if (!mounted) return null; // ✅ prevents mismatch

  const changeLanguage = (lang: string) => {
    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`);
    router.push(newPath);
  };

  return (
    <select
      value={currentLang}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}