import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyRecaptcha } from "@/lib/verifyRecaptcha";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      message,
      recaptchaToken,
    } = body;

    if (
      !name ||
      !email ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        { status: 400 }
      );
    }

    const captchaResult =
      await verifyRecaptcha(
        recaptchaToken
      );

    if (
      !captchaResult.success
    ) {
      return NextResponse.json(
        {
          error:
            "Security verification failed",
        },
        {
          status: 400,
        }
      );
    }

    if (
      captchaResult.score <
      0.5
    ) {
      return NextResponse.json(
        {
          error:
            "Request flagged as suspicious",
        },
        {
          status: 403,
        }
      );
    }

    if (
      captchaResult.action !==
      "contact_submit"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid verification action",
        },
        {
          status: 403,
        }
      );
    }

    await resend.emails.send({
      from: "Website Contact <info@luxeplainsafricasafaris.com>",
      to: process.env.BOOKING_EMAIL!,
      replyTo: email,
      subject: `New Contact Form Message - ${name}`,
      html: `
        <h2>New Contact Form Message</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>

        <p>${message.replace(
          /\n/g,
          "<br />"
        )}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to send message",
      },
      {
        status: 500,
      }
    );
  }
}