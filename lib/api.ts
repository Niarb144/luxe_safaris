const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTours(lang: string) {
  const res = await fetch(`${API_URL}/test?lang=${lang}`);
   console.log("STATUS:", res.status);

  const text = await res.text(); // 👈 TEMP DEBUG
  console.log("RAW RESPONSE:", text);

  return JSON.parse(text); // will crash if not JSON
//   return res.json();
}