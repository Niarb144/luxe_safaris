import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  emailHeader,
  emailSectionHeading,
  emailFooter,
  emailButton,
} from "@/lib/email/helpers"; // adjust path to match your project structure

// Service-role client — server-only, never expose this key to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.3);

// ── Welcome email template ────────────────────────────────────────────────
function newsletterWelcomeEmail(email: string) {
  return `
    <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

        ${emailHeader("Welcome to Luxe Plains Africa Safaris")}

        <!-- Welcome message -->
        <tr>
          <td style="padding:28px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${emailSectionHeading("You're on the list")}
              <tr>
                <td style="padding:10px 0 20px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.7; color:#14201A;">
                  Thank you for subscribing to the Luxe Plains Africa Safaris newsletter. You'll be the first to hear about new safari itineraries, seasonal offers, and travel inspiration from across East Africa's most iconic landscapes.
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 28px 0;">
                  ${emailButton("Explore Our Safaris", "https://luxeplainsafricasafaris.com")}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${emailFooter("Subscribed Email", email)}

      </table>
    </div>
  `;
}

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

    // ── Send welcome email (non-fatal) ────────────────────────────────────────
    const { error: emailError } = await resend.emails.send({
      from: "Luxe Plains Africa Safaris <newsletter@luxeplainsafricasafaris.com>",
      to: normalizedEmail,
      subject: "Welcome to Luxe Plains Africa Safaris",
      html: newsletterWelcomeEmail(normalizedEmail),
    });

    if (emailError) {
      console.error("Newsletter welcome email error:", emailError);
      // Don't fail the request — the subscription itself succeeded.
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}