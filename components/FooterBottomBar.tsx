"use client";

import Link from "next/link";
import { T } from "./T";

export default function FooterBottomBar() {
  return (
    <div className="border-t border-white/20 text-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
      <p>
        <T text="© {new Date().getFullYear()} Luxe Plains Safaris." />
      </p>
      <div className="flex gap-4">
        <Link href="/privacy-policy">
          <span className="cursor-pointer hover:underline">
            <T text="Privacy policy" />
          </span>
        </Link>
      </div>
    </div>
  );
}