// app/[locale]/newsletter/unsubscribed/page.tsx
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4] px-4 py-16">
      <div className="w-full max-w-md rounded-xl overflow-hidden border border-[#e8e2d9] bg-[#F2EDE3] shadow-sm">
        {/* Header — matches email header styling */}
        <div className="bg-[#14201A] px-8 py-8">
          <p className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-[#B98A3E] font-bold">
            LUXE PLAINS AFRICA SAFARIS
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-10 text-center">
          {isSuccess ? (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full bg-[#B98A3E]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#B98A3E]" strokeWidth={1.75} />
                </div>
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#14201A] mb-2">
                You've been unsubscribed
              </h1>
              <p className="text-sm leading-relaxed text-[#6b7a6e]">
                You won't receive any further newsletter emails from Luxe Plains Africa Safaris. You're welcome to subscribe again any time from our website.
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" strokeWidth={1.75} />
                </div>
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#14201A] mb-2">
                We couldn't process that request
              </h1>
              <p className="text-sm leading-relaxed text-[#6b7a6e]">
                This unsubscribe link may have expired or already been used. If you're still receiving emails you'd like to stop, please contact us directly.
              </p>
            </>
          )}

          <Link
            href="/"
            className="inline-block mt-8 rounded-md bg-[#B98A3E] px-6 py-3 text-sm font-semibold text-[#F2EDE3] hover:opacity-90 transition-opacity"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}