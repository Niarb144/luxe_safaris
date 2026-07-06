// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyRecaptcha } from "@/lib/verifyRecaptcha";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Luxe Plains Africa Safaris <info@luxeplainsafricasafaris.com>";
const NOTIFICATION_EMAIL = process.env.BOOKING_EMAIL!;

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

function buildCompanyContactNotificationEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("New Contact Form Message")}

      <!-- Contact -->
      <tr>
        <td style="padding:28px 32px 0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Contact")}
            ${emailRow("Name", name)}
            ${emailRow("Email", `<a href="mailto:${email}" style="color:#B98A3E; text-decoration:none;">${email}</a>`)}
          </table>
        </td>
      </tr>

      <!-- Message -->
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Message")}
            <tr>
              <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#14201A;">
                ${message.replace(/\n/g, "<br />")}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${emailFooter("Submitted By", name)}

    </table>
  </div>
  `;
}

function buildCustomerContactConfirmationEmail({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  return `
  <div style="background:#f9f7f4; padding:32px 16px; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#F2EDE3; border-radius:10px; overflow:hidden; border:1px solid #e8e2d9;">

      ${emailHeader("We've Received Your Message")}

      <!-- Body -->
      <tr>
        <td style="padding:28px 32px 8px 32px;">
          <p style="margin:0 0 8px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:#14201A;">
            Dear ${name},
          </p>
          <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#6b7a6e;">
            Thank you for reaching out to Luxe Plains Africa Safaris. We've received your message and a member of our team will get back to you shortly.
          </p>
        </td>
      </tr>

      <!-- Their message, for reference -->
      <tr>
        <td style="padding:0 32px 28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${emailSectionHeading("Your Message")}
            <tr>
              <td style="padding:10px 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#14201A;">
                ${message.replace(/\n/g, "<br />")}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${emailFooter("Sent By", name)}

    </table>

    <p style="max-width:600px; margin:16px auto 0 auto; text-align:center; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#6b7a6e;">
      If you have any questions in the meantime, simply reply to this email.
    </p>
  </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, recaptchaToken } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const captchaResult = await verifyRecaptcha(recaptchaToken);

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

    if (captchaResult.action !== "contact_submit") {
      return NextResponse.json(
        { error: "Invalid verification action" },
        { status: 403 }
      );
    }

    // ── Notify the company ───────────────────────────────────────────────
    const { error: companyEmailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New Contact Form Message - ${name}`,
      html: buildCompanyContactNotificationEmail({ name, email, message }),
    });

    if (companyEmailError) {
      console.error("Contact company notification failed:", companyEmailError);
    }

    // ── Confirm to the customer ──────────────────────────────────────────
    const { error: customerEmailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We've Received Your Message — Luxe Plains Africa Safaris",
      html: buildCustomerContactConfirmationEmail({ name, message }),
    });

    if (customerEmailError) {
      // Don't fail the request over a confirmation email hiccup — the
      // company notification above is the one that actually matters.
      console.error("Contact customer confirmation failed:", customerEmailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}