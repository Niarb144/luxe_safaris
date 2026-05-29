"use client";


export default function FooterBottomBar() {
  return (
    <div className="border-t border-white/20 text-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
      <p>© {new Date().getFullYear()} Luxe Plains Safaris.</p>
      <div className="flex gap-4">
        <span className="cursor-pointer hover:underline">Privacy policy</span>
      </div>
    </div>
  );
}