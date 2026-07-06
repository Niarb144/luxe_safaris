// app/api/safari-inquiry/route.ts
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// ── The inbox address that receives inquiry notifications ──────────────────
const NOTIFICATION_EMAIL = process.env.BOOKING_EMAIL ?? "inquiries@luxeplainsafrica.com";
const FROM_EMAIL         = process.env.RESEND_FROM_EMAIL ?? "Luxe Plains Africa Safaris <noreply@luxeplainsafricasafaris.com>";

function formatReceivedAt(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " at " + new Date(isoString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Shared email building blocks — keep header/footer/section styling consistent
// across every transactional email (booking confirmation, inquiry, contact, etc).
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

function emailFooter(referenceLabel: string, referenceValue: string, receivedAt: string) {
  return `
    <tr>
      <td style="background:#14201A; padding:16px 32px;">
        <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#B98A3E;">
          ${referenceLabel}: <span style="color:#ffffff;">${referenceValue}</span>
          &nbsp;&middot;&nbsp;
          <span style="color:#ffffff;">Received: ${receivedAt}</span>
        </p>
      </td>
    </tr>
  `;
}

function buildCompanyInquiryNotificationEmail({
  inquiryId,
  createdAt,
  full_name,
  email,
  country_code,
  mobile_number,
  destinations,
  country,
  holiday_type,
  classification,
  adults,
  children_0_3,
  children_4_11,
  children_12_17,
  totalGuests,
}: {
  inquiryId: string;
  createdAt: string;
  full_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  destinations: string[];
  country: string;
  holiday_type: string;
  classification: string;
  adults: number;
  children_0_3: number;
  children_4_11: number;
  children_12_17: number;
  totalGuests: number;
}) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("New Custom Safari Inquiry")}

      <!-- Contact -->
      <tr>
        <td style="padding:28px 32px 0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Contact")}
            ${emailRow("Name", full_name)}
            ${emailRow("Email", `<a href="mailto:${email}" style="color:#B98A3E; text-decoration:none;">${email}</a>`)}
            ${emailRow("Mobile", `${country_code} ${mobile_number}`)}
          </table>
        </td>
      </tr>

      <!-- Trip Details -->
      <tr>
        <td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Trip Details")}
            ${emailRow("Country of Origin", country)}
            ${emailRow("Holiday Type", holiday_type)}
            ${emailRow("Destinations", destinations.join(", "))}
            ${emailRow("Accommodation", classification)}
          </table>
        </td>
      </tr>

      <!-- Guests -->
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading(`Guests (${totalGuests} Total)`)}
            ${emailRow("Adults", String(adults))}
            ${emailRow("Children (0–3)", String(children_0_3))}
            ${emailRow("Children (4–11)", String(children_4_11))}
            ${emailRow("Children (12–17)", String(children_12_17))}
          </table>
        </td>
      </tr>

      ${emailFooter("Inquiry ID", inquiryId.slice(0, 8), formatReceivedAt(createdAt))}

    </table>
  </div>
  `;
}

function buildCustomerInquiryConfirmationEmail({
  inquiryId,
  createdAt,
  full_name,
  destinations,
  country,
  holiday_type,
  classification,
  adults,
  children_0_3,
  children_4_11,
  children_12_17,
  totalGuests,
}: {
  inquiryId: string;
  createdAt: string;
  full_name: string;
  destinations: string[];
  country: string;
  holiday_type: string;
  classification: string;
  adults: number;
  children_0_3: number;
  children_4_11: number;
  children_12_17: number;
  totalGuests: number;
}) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("Your Safari Inquiry Has Been Received")}

      <!-- Body -->
      <tr>
        <td style="padding:28px 32px 8px 32px;">
          <p style="margin:0 0 8px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#14201A;">
            Dear ${full_name},
          </p>
          <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#6b7a6e;">
            Thank you for your interest in a custom safari with Luxe Plains Africa Safaris. We've received your inquiry and one of our safari specialists will be in touch shortly with tailored recommendations.
          </p>
        </td>
      </tr>

      <!-- Trip Details -->
      <tr>
        <td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Trip Details")}
            ${emailRow("Country of Origin", country)}
            ${emailRow("Holiday Type", holiday_type)}
            ${emailRow("Destinations", destinations.join(", "))}
            ${emailRow("Accommodation", classification)}
          </table>
        </td>
      </tr>

      <!-- Guests -->
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading(`Guests (${totalGuests} Total)`)}
            ${emailRow("Adults", String(adults))}
            ${emailRow("Children (0–3)", String(children_0_3))}
            ${emailRow("Children (4–11)", String(children_4_11))}
            ${emailRow("Children (12–17)", String(children_12_17))}
          </table>
        </td>
      </tr>

      ${emailFooter("Inquiry Reference", inquiryId.slice(0, 8), formatReceivedAt(createdAt))}

    </table>

    <p style="max-width:600px; margin:16px auto 0 auto; text-align:center; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#6b7a6e;">
      If you have any questions in the meantime, simply reply to this email.
    </p>
  </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      country_code,
      mobile_number,
      destinations,
      country,
      holiday_type,
      adults,
      children_0_3,
      children_4_11,
      children_12_17,
      classification,
    } = body;

    // ── Basic server-side validation ─────────────────────────────────────
    if (!full_name || !email || !country_code || !mobile_number || !country || !holiday_type || !classification) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json({ error: "Select at least one destination." }, { status: 400 });
    }
    if (typeof adults !== "number" || adults < 1) {
      return NextResponse.json({ error: "At least one adult is required." }, { status: 400 });
    }

    // ── Persist to Supabase ──────────────────────────────────────────────
    const { data: inquiry, error: dbError } = await supabase
      .from("safari_inquiries")
      .insert({
        full_name,
        email,
        country_code,
        mobile_number,
        destinations,
        country,
        holiday_type,
        adults,
        children_0_3:   children_0_3  ?? 0,
        children_4_11:  children_4_11 ?? 0,
        children_12_17: children_12_17 ?? 0,
        classification,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
    }

    const totalGuests =
      adults +
      (children_0_3  ?? 0) +
      (children_4_11 ?? 0) +
      (children_12_17 ?? 0);

    const sharedEmailData = {
      inquiryId: inquiry.id,
      createdAt: inquiry.created_at,
      full_name,
      destinations,
      country,
      holiday_type,
      classification,
      adults,
      children_0_3: children_0_3 ?? 0,
      children_4_11: children_4_11 ?? 0,
      children_12_17: children_12_17 ?? 0,
      totalGuests,
    };

    // ── Notify the company ───────────────────────────────────────────────
    const { error: companyEmailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New Safari Inquiry — ${full_name} (${inquiry.id.slice(0, 8)})`,
      html: buildCompanyInquiryNotificationEmail({
        ...sharedEmailData,
        email,
        country_code,
        mobile_number,
      }),
    });

    if (companyEmailError) {
      // Log but don't fail — data is already saved
      console.error("Inquiry company notification failed:", companyEmailError);
    }

    // ── Confirm to the customer ──────────────────────────────────────────
    const { error: customerEmailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Safari Inquiry Has Been Received — Luxe Plains Africa Safaris",
      html: buildCustomerInquiryConfirmationEmail(sharedEmailData),
    });

    if (customerEmailError) {
      console.error("Inquiry customer confirmation failed:", customerEmailError);
    }

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("Safari inquiry route error:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}