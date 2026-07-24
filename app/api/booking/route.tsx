import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyRecaptcha(token: string) {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    }
  );

  return response.json();
}

function formatTravelDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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

// Shared email building blocks — keep header/footer/section styling consistent
// across every transactional email (booking confirmation, inquiry, etc).
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

function emailFooter(referenceLabel: string, referenceValue: string) {
  return `
    <tr>
      <td style="background:#14201A; padding:16px 32px;">
        <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#B98A3E;">
          ${referenceLabel}: <span style="color:#ffffff;">${referenceValue}</span>
          &nbsp;&middot;&nbsp;
          <span style="color:#ffffff;">Received: ${formatReceivedAt()}</span>
        </p>
      </td>
    </tr>
  `;
}

function buildCustomerConfirmationEmail({
  full_name,
  tour_title,
  booking_reference,
  travel_date,
  adults,
  children_under_3,
  children_4_11,
  children_12_17,
  phone,
  country,
  email,
}: {
  full_name: string;
  tour_title: string;
  booking_reference: string;
  travel_date: string;
  adults: number;
  children_under_3: number;
  children_4_11: number;
  children_12_17: number;
  phone: string;
  country: string;
  email: string;
}) {
  const totalGuests =
    Number(adults) +
    Number(children_under_3) +
    Number(children_4_11) +
    Number(children_12_17);

  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("Your Safari Booking Request Has Been Received")}

      <!-- Body -->
      <tr>
        <td style="padding:28px 32px 8px 32px;">
          <p style="margin:0 0 8px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#14201A;">
            Dear ${full_name},
          </p>
          <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#6b7a6e;">
            Thank you for booking with Luxe Plains Africa Safaris. We've received your request for the
            <strong style="color:#14201A;">${tour_title}</strong> safari and our team is reviewing the details now.
            You'll hear from us shortly to confirm availability and next steps.
          </p>
        </td>
      </tr>

      <!-- Trip Details -->
      <tr>
        <td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Trip Details")}
            ${emailRow("Safari", tour_title)}
            ${emailRow("Travel Date", formatTravelDate(travel_date))}
            ${emailRow("Guests", `${totalGuests} total`)}
          </table>
        </td>
      </tr>

      <!-- Guest Breakdown -->
      <tr>
        <td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading(`Guests (${totalGuests} Total)`)}
            ${emailRow("Adults", String(adults))}
            ${emailRow("Children (0–3)", String(children_under_3))}
            ${emailRow("Children (4–11)", String(children_4_11))}
            ${emailRow("Children (12–17)", String(children_12_17))}
          </table>
        </td>
      </tr>

      <!-- Contact -->
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Your Contact Details")}
            ${emailRow("Email", email)}
            ${emailRow("Mobile", phone || "Not provided")}
            ${emailRow("Country", country || "Not provided")}
          </table>
        </td>
      </tr>

      ${emailFooter("Booking Reference", booking_reference)}

    </table>

    <p style="max-width:600px; margin:16px auto 0 auto; text-align:center; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#6b7a6e;">
      If you have any questions in the meantime, simply reply to this email.
    </p>
  </div>
  `;
}

function buildCompanyNotificationEmail({
  tour_title,
  booking_reference,
  full_name,
  email,
  phone,
  country,
  adults,
  childrenSummary,
  travel_date,
  special_requests,
}: {
  tour_title: string;
  booking_reference: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  adults: number;
  childrenSummary: string;
  travel_date: string;
  special_requests: string;
}) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("New Safari Booking Request")}

      <!-- Contact -->
      <tr>
        <td style="padding:28px 32px 0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Contact")}
            ${emailRow("Name", full_name)}
            ${emailRow("Email", `<a href="mailto:${email}" style="color:#B98A3E; text-decoration:none;">${email}</a>`)}
            ${emailRow("Mobile", phone || "Not provided")}
            ${emailRow("Country", country || "Not provided")}
          </table>
        </td>
      </tr>

      <!-- Trip Details -->
      <tr>
        <td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Trip Details")}
            ${emailRow("Safari", tour_title)}
            ${emailRow("Travel Date", formatTravelDate(travel_date))}
            ${emailRow("Adults", String(adults))}
            ${emailRow("Children", childrenSummary)}
          </table>
        </td>
      </tr>

      <!-- Special Requests -->
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Special Requests")}
            <tr>
              <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#14201A;">
                ${special_requests || "None"}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${emailFooter("Booking Reference", booking_reference)}

    </table>
  </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      recaptchaToken,
      tour_id,
      tour_title,
      full_name,
      email,
      phone,
      country,
      adults,
      children_under_3,
      children_4_11,
      children_12_17,
      travel_date,
      special_requests,
    } = body;

    if (!full_name || !email || !travel_date || !tour_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const captchaResult = await verifyRecaptcha(recaptchaToken);

    // console.log(captchaResult);

    if (!captchaResult.success) {
      return NextResponse.json(
        { error: "Security verification failed" },
        { status: 400 }
      );
    }

    if (captchaResult.score < 0.5) {
      return NextResponse.json(
        { error: "Request flagged as suspicious" },
        { status: 403 }
      );
    }

    if (captchaResult.action !== "booking_submit") {
      return NextResponse.json(
        { error: "Invalid verification action" },
        { status: 403 }
      );
    }

    // Save booking — select the inserted row back so we get booking_reference
    const { data: insertedBooking, error } = await supabase
      .from("bookings")
      .insert([
        {
          tour_id,
          full_name,
          email,
          phone,
          country,
          adults,
          children_under_3: children_under_3 ?? 0,
          children_4_11: children_4_11 ?? 0,
          children_12_17: children_12_17 ?? 0,
          travel_date,
          special_requests,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Derive a readable total-children summary for the email
    const childrenSummary = [
      children_under_3 > 0 ? `${children_under_3} under 3 (free)` : null,
      children_4_11 > 0 ? `${children_4_11} aged 4–11 (40% off)` : null,
      children_12_17 > 0 ? `${children_12_17} aged 12–17 (17% off)` : null,
    ]
      .filter(Boolean)
      .join(", ") || "None";

    // Send company notification
    const { error: companyEmailError } = await resend.emails.send({
      from: "Bookings <noreply@luxeplainsafricasafaris.com>",
      to: process.env.BOOKING_EMAIL!,
      cc: process.env.INFO_EMAIL,
      subject: `New Safari Request - ${full_name}`,
      html: buildCompanyNotificationEmail({
        tour_title,
        booking_reference: insertedBooking?.booking_reference ?? "Pending",
        full_name,
        email,
        phone,
        country,
        adults,
        childrenSummary,
        travel_date,
        special_requests,
      }),
    });

    if (companyEmailError) {
      console.error("Company notification email failed:", companyEmailError);
    }

    // Send customer confirmation email
    const { error: customerEmailError } = await resend.emails.send({
      from: "Luxe Plains Africa Safaris <info@luxeplainsafricasafaris.com>",
      to: email,
      subject: `Booking Request Received — ${tour_title}`,
      html: buildCustomerConfirmationEmail({
        full_name,
        tour_title,
        booking_reference: insertedBooking?.booking_reference ?? "Pending",
        travel_date,
        adults,
        children_under_3: children_under_3 ?? 0,
        children_4_11: children_4_11 ?? 0,
        children_12_17: children_12_17 ?? 0,
        phone,
        country,
        email,
      }),
    });

    if (customerEmailError) {
      // Booking already saved — don't fail the request over a confirmation email hiccup,
      // just log it so it can be investigated / resent.
      console.error("Customer confirmation email failed:", customerEmailError);
    }

    return NextResponse.json({
      success: true,
      booking_reference: insertedBooking?.booking_reference ?? null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}