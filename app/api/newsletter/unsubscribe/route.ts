// app/api/newsletter/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const SITE_URL = "https://luxeplainsafricasafaris.com";

async function unsubscribeByToken(token: string | null) {
  if (!token) return { ok: false as const, reason: "invalid" as const };

  const { data, error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null) // no-op if already unsubscribed
    .select("email, locale")
    .maybeSingle();

  if (error) {
    console.error("Unsubscribe error:", error);
    return { ok: false as const, reason: "error" as const };
  }

  if (!data) {
    // Either token doesn't exist, or was already unsubscribed — either way,
    // from the user's perspective the outcome is the same: they're not subscribed.
    return { ok: true as const, alreadyUnsubscribed: true, locale: null };
  }

  return { ok: true as const, alreadyUnsubscribed: false, locale: data.locale };
}

// One-click unsubscribe (RFC 8058) — triggered automatically by email
// clients via the List-Unsubscribe-Post header. No redirect; just a status.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const result = await unsubscribeByToken(token);

  return NextResponse.json(
    { success: result.ok },
    { status: result.ok ? 200 : 400 }
  );
}

// In-body link click — a person following the link in the email footer.
// Redirects to a branded confirmation page.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const result = await unsubscribeByToken(token);
  const locale = result.ok ? result.locale ?? "en" : "en";

  const status = result.ok ? "success" : result.reason;
  return NextResponse.redirect(
    `${SITE_URL}/${locale}/newsletter/unsubscribed?status=${status}`
  );
}