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

    console.log(captchaResult);

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

    // Save booking
    const { error } = await supabase.from("bookings").insert([
      {
        tour_id,
        full_name,
        email,
        phone,
        adults,
        children_under_3: children_under_3 ?? 0,
        children_4_11: children_4_11 ?? 0,
        children_12_17: children_12_17 ?? 0,
        travel_date,
        special_requests,
      },
    ]);

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
    await resend.emails.send({
      from: "Bookings <info@luxeplainsafricasafaris.com>",
      to: process.env.BOOKING_EMAIL!,
      subject: `New Booking Request - ${full_name}`,
      html: `
        <h2>New ${tour_title} Booking</h2>

        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Adults:</strong> ${adults}</p>
        <p><strong>Children:</strong> ${childrenSummary}</p>
        <p><strong>Travel Date:</strong> ${travel_date}</p>

        <p><strong>Special Requests</strong></p>
        <p>${special_requests || "None"}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}