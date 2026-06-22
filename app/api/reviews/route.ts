import { NextResponse } from "next/server";

/**
 * GET /api/reviews?platform=google|tripadvisor
 *
 * Environment variables required:
 *
 *   GOOGLE_PLACE_ID          – from Google Maps (starts with ChIJ…)
 *   GOOGLE_PLACES_API_KEY    – from Google Cloud Console (Places API enabled)
 *
 *   TRIPADVISOR_LOCATION_ID  – numeric ID from your TripAdvisor listing URL
 *   TRIPADVISOR_API_KEY      – from https://tripadvisor.io/developers
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");

  // ── Google Places ──────────────────────────────────────────────────────────
  if (platform === "google") {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      return NextResponse.json(
        { error: "Google Places credentials not configured" },
        { status: 503 }
      );
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${placeId}` +
      `&fields=reviews,rating,user_ratings_total` +
      `&reviews_sort=newest` +
      `&key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 h
    if (!res.ok) {
      return NextResponse.json(
        { error: "Google Places API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data.result ?? {});
  }

  // ── Tripadvisor Content API ────────────────────────────────────────────────
  if (platform === "tripadvisor") {
    const locationId = process.env.TRIPADVISOR_LOCATION_ID;
    const apiKey = process.env.TRIPADVISOR_API_KEY;

    if (!locationId || !apiKey) {
      return NextResponse.json(
        { error: "Tripadvisor credentials not configured" },
        { status: 503 }
      );
    }

    const url =
      `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews` +
      `?language=en&key=${apiKey}`;

    const res = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Tripadvisor API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
}