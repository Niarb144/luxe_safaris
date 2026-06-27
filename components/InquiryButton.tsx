"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CustomSafariCTA() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("cta");

  return (
    <>
    <div className="bg-green-500 text-white">
        <Link href="/custom-safari">
        Create Your Safari
      </Link>
    </div>
      
    </>
  );
}