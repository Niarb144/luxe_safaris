import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — server-only, never expose this key to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.3);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const locale = typeof body?.locale === "string" ? body.locale : null;
    const recaptchaToken =
      typeof body?.recaptchaToken === "string" ? body.recaptchaToken : null;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    if (!recaptchaToken) {
      return NextResponse.json({ error: "missing_recaptcha" }, { status: 400 });
    }

    // ── Verify reCAPTCHA v3 token ────────────────────────────────────────────
    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: recaptchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaRes.json();

    if (
      !recaptchaData.success ||
      (typeof recaptchaData.score === "number" &&
        recaptchaData.score < RECAPTCHA_MIN_SCORE)
    ) {
      console.warn("Newsletter recaptcha rejected:", recaptchaData);
      return NextResponse.json({ error: "recaptcha_failed" }, { status: 400 });
    }

    // ── Insert subscriber ─────────────────────────────────────────────────────
    const normalizedEmail = email.toLowerCase();

    const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({
      email: normalizedEmail,
      locale,
      source: "footer",
    });

    if (error) {
      // Unique violation → already subscribed. Treat as success so the
      // person isn't shown an error for something that isn't really one.
      if (error.code === "23505") {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      console.error("Newsletter insert error:", error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}