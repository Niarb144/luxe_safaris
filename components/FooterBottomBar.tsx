"use client";

import Link from "next/link";

export default function FooterBottomBar() {
  return (
    <div className="border-t border-white/20 text-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
      <p>
        © {new Date().getFullYear()} Luxe Plains Safaris. All rights reserved.
      </p>
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