import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      tour_id,
      full_name,
      email,
      phone,
      adults,
      children,
      travel_date,
      special_requests,
    } = body;

    if (
      !full_name ||
      !email ||
      !travel_date ||
      !tour_id
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save booking

    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          tour_id,
          full_name,
          email,
          phone,
          adults,
          children,
          travel_date,
          special_requests,
        },
      ]);

    if (error) {
      throw error;
    }

    // Send company notification

    await resend.emails.send({
      from: "Bookings <luxeplainsafricasafaris@gmail.com>",
      to: process.env.BOOKING_EMAIL!,
      subject: `New Booking Request - ${full_name}`,
      html: `
        <h2>New Safari Booking</h2>

        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Adults:</strong> ${adults}</p>
        <p><strong>Children:</strong> ${children}</p>
        <p><strong>Travel Date:</strong> ${travel_date}</p>

        <p><strong>Special Requests</strong></p>
        <p>${special_requests || "None"}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to submit booking",
      },
      {
        status: 500,
      }
    );
  }
}