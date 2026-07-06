import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = "https://luxeplainsafricasafaris.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.3);

function formatReceivedAt() {
  return (
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) +
    " at " +
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function emailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#6b7a6e; width:40%;">
        ${label}
      </td>
      <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#14201A; font-weight:600;">
        ${value}
      </td>
    </tr>
  `;
}

function emailSectionHeading(title: string) {
  return `
    <tr>
      <td style="padding:28px 0 6px 0;">
        <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#B98A3E; font-weight:700;">
          ${title}
        </p>
        <div style="height:1px; background:#e8e2d9; margin-top:10px;"></div>
      </td>
    </tr>
  `;
}

function emailHeader(subtitle: string) {
  return `
    <tr>
      <td style="background:#14201A; padding:32px 32px 28px 32px;">
        <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:20px; letter-spacing:1px; color:#B98A3E; font-weight:700;">
          LUXE PLAINS AFRICA SAFARIS
        </p>
        <p style="margin:6px 0 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#ffffff;">
          ${subtitle}
        </p>
      </td>
    </tr>
  `;
}

// Footer now accepts an optional unsubscribe URL — used across newsletter
// emails going forward. Booking/inquiry emails can omit it (undefined) and
// keep their current appearance untouched.
function emailFooter(
  referenceLabel: string,
  referenceValue: string,
  unsubscribeUrl?: string
) {
  return `
    <tr>
      <td style="background:#14201A; padding:16px 32px;">
        <p style="margin:0 0 6px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#B98A3E;">
          ${referenceLabel}: <span style="color:#ffffff;">${referenceValue}</span>
          &nbsp;&middot;&nbsp;
          <span style="color:#ffffff;">Received: ${formatReceivedAt()}</span>
        </p>
        ${
          unsubscribeUrl
            ? `<p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#8a9a8d;">
                <a href="${unsubscribeUrl}" style="color:#8a9a8d; text-decoration:underline;">Unsubscribe</a> from these emails at any time.
              </p>`
            : ""
        }
      </td>
    </tr>
  `;
}

function emailButton(text: string, href: string) {
  return `
    <a href="${href}" style="display:inline-block; background:#B98A3E; color:#F2EDE3; text-decoration:none; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:600; padding:12px 24px; border-radius:6px;">
      ${text}
    </a>
  `;
}

function buildSubscriberWelcomeEmail(email: string, unsubscribeUrl: string) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("Welcome to Luxe Plains Africa Safaris")}

      <tr>
        <td style="padding:28px 32px 0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("You're on the list")}
            <tr>
              <td style="padding:10px 0 20px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.7; color:#6b7a6e;">
                Thank you for subscribing to the Luxe Plains Africa Safaris newsletter. You'll be the first to hear about new safari itineraries, seasonal offers, and travel inspiration from across East Africa's most iconic landscapes.
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 28px 0;">
                ${emailButton("Explore Our Safaris", SITE_URL)}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${emailFooter("Subscribed Email", email, unsubscribeUrl)}

    </table>
  </div>
  `;
}

function buildCompanyNewsletterNotificationEmail({
  email,
  locale,
}: {
  email: string;
  locale: string | null;
}) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("New Newsletter Subscriber")}

      <tr>
        <td style="padding:28px 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Subscriber")}
            ${emailRow("Email", `<a href="mailto:${email}" style="color:#B98A3E; text-decoration:none;">${email}</a>`)}
            ${emailRow("Locale", locale || "Not detected")}
            ${emailRow("Source", "Footer")}
          </table>
        </td>
      </tr>

      ${emailFooter("Subscribed At", formatReceivedAt())}

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

    const normalizedEmail = email.toLowerCase();

    // Select the row back so we get the auto-generated unsubscribe_token.
    const { data: subscriber, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: normalizedEmail, locale, source: "footer" })
      .select("unsubscribe_token")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      console.error("Newsletter insert error:", error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`;

    const { error: subscriberEmailError } = await resend.emails.send({
      from: "Luxe Plains Africa Safaris <info@luxeplainsafricasafaris.com>",
      to: normalizedEmail,
      subject: "Welcome to Luxe Plains Africa Safaris",
      html: buildSubscriberWelcomeEmail(normalizedEmail, unsubscribeUrl),
      headers: {
        // Powers the native "Unsubscribe" button Gmail/Outlook show next to
        // the sender name — separate from the in-body link above.
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (subscriberEmailError) {
      console.error("Subscriber welcome email failed:", subscriberEmailError);
    }

    const { error: companyEmailError } = await resend.emails.send({
      from: "Newsletter <noreply@luxeplainsafricasafaris.com>",
      to: process.env.NEWSLETTER_NOTIFY_EMAIL ?? process.env.BOOKING_EMAIL!,
      subject: `New Newsletter Subscriber - ${normalizedEmail}`,
      html: buildCompanyNewsletterNotificationEmail({
        email: normalizedEmail,
        locale,
      }),
    });

    if (companyEmailError) {
      console.error("Newsletter company notification failed:", companyEmailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}