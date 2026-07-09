"use client";

import Link from "next/link";
import Image from "next/image";

export default function FooterBottomBar() {
  return (
    <div className="border-t border-white/20 text-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
      <p>
        © {new Date().getFullYear()} Luxe Plains Africa Safaris. All rights reserved.
      </p>

      <Link
        href="https://teddybrian.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <Image
          src="/images/teddy-logo.png"
          alt="Nidari Inc"
          width={22}
          height={22}
          className="rounded-sm"
        />
        <span>Powered by Nidari Inc</span>
      </Link>
      <p className="text-white/50 text-xs text-center">
        Protected by reCAPTCHA &mdash;{" "}
        <Link
        
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Privacy Policy
        </Link>{" "}
        &amp;{" "}
        
        <Link
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Terms of Service
        </Link>{" "}
        apply.
      </p>
    </div>
  );
}