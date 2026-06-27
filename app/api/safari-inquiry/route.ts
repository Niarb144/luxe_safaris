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
const FROM_EMAIL         = process.env.RESEND_FROM_EMAIL ?? "Luxe Plains Africa <noreply@luxeplainsafrica.com>";

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

    // ── Send notification email ──────────────────────────────────────────
    const { error: emailError } = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      NOTIFICATION_EMAIL,
      subject: `New Safari Inquiry — ${full_name} (${inquiry.id.slice(0, 8)})`,
      html: `
        <div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;color:#14201A;background:#F2EDE3;padding:0;">
          <div style="background:#14201A;padding:28px 32px;">
            <h1 style="margin:0;font-size:22px;color:#B98A3E;letter-spacing:0.04em;">LUXE PLAINS AFRICA SAFARIS</h1>
            <p style="margin:6px 0 0;color:#c9bfa8;font-size:13px;font-family:Arial,sans-serif;">New Custom Safari Inquiry</p>
          </div>

          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
              <tr><td colspan="2" style="padding-bottom:8px;border-bottom:1px solid #d4c9b5;font-size:11px;letter-spacing:0.12em;color:#7a6e5f;text-transform:uppercase;font-weight:600;">Contact</td></tr>
              <tr><td style="padding:10px 0 4px;width:180px;color:#7a6e5f;">Name</td><td style="padding:10px 0 4px;font-weight:600;">${full_name}</td></tr>
              <tr><td style="padding:4px 0;color:#7a6e5f;">Email</td><td style="padding:4px 0;"><a href="mailto:${email}" style="color:#B98A3E;">${email}</a></td></tr>
              <tr><td style="padding:4px 0 16px;color:#7a6e5f;">Mobile</td><td style="padding:4px 0 16px;">${country_code} ${mobile_number}</td></tr>

              <tr><td colspan="2" style="padding-bottom:8px;border-bottom:1px solid #d4c9b5;font-size:11px;letter-spacing:0.12em;color:#7a6e5f;text-transform:uppercase;font-weight:600;">Trip Details</td></tr>
              <tr><td style="padding:10px 0 4px;color:#7a6e5f;">Country of Origin</td><td style="padding:10px 0 4px;">${country}</td></tr>
              <tr><td style="padding:4px 0;color:#7a6e5f;">Holiday Type</td><td style="padding:4px 0;">${holiday_type}</td></tr>
              <tr><td style="padding:4px 0;color:#7a6e5f;">Destinations</td><td style="padding:4px 0;">${destinations.join(", ")}</td></tr>
              <tr><td style="padding:4px 0 16px;color:#7a6e5f;">Accommodation</td><td style="padding:4px 0 16px;">${classification}</td></tr>

              <tr><td colspan="2" style="padding-bottom:8px;border-bottom:1px solid #d4c9b5;font-size:11px;letter-spacing:0.12em;color:#7a6e5f;text-transform:uppercase;font-weight:600;">Guests (${totalGuests} total)</td></tr>
              <tr><td style="padding:10px 0 4px;color:#7a6e5f;">Adults</td><td style="padding:10px 0 4px;">${adults}</td></tr>
              <tr><td style="padding:4px 0;color:#7a6e5f;">Children (0–3)</td><td style="padding:4px 0;">${children_0_3 ?? 0}</td></tr>
              <tr><td style="padding:4px 0;color:#7a6e5f;">Children (4–11)</td><td style="padding:4px 0;">${children_4_11 ?? 0}</td></tr>
              <tr><td style="padding:4px 0 16px;color:#7a6e5f;">Children (12–17)</td><td style="padding:4px 0 16px;">${children_12_17 ?? 0}</td></tr>
            </table>

            <div style="margin-top:24px;padding:16px;background:#14201A;border-radius:4px;text-align:center;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#c9bfa8;">
                Inquiry ID: <strong style="color:#B98A3E;">${inquiry.id}</strong> &nbsp;·&nbsp;
                Received: ${new Date(inquiry.created_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailError) {
      // Log but don't fail — data is already saved
      console.error("Resend email error:", emailError);
    }

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("Safari inquiry route error:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}