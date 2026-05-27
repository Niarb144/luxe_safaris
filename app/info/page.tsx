"use client";

import {
  FaPassport,
  FaShieldAlt,
  FaMoneyBillWave,
  FaSyringe,
  FaWifi,
  FaCloudSun,
  FaCar,
  FaPhone,
  FaGlobeAfrica,
} from "react-icons/fa";

export default function PracticalInfoPage() {
  const sections = [
    {
      icon: <FaPassport />,
      title: "Visa & Entry Requirements",
      content: [
        "Kenya: eVisa required for many travelers. East Africa Tourist Visa available.",
        "Uganda: eVisa required for most visitors.",
        "Tanzania: Visa on arrival available for many nationalities.",
        "East Africa Tourist Visa covers Kenya, Uganda & Rwanda (single visa).",
        "Passport validity: Minimum 6 months before expiry.",
      ],
    },
    {
      icon: <FaSyringe />,
      title: "Health & Vaccinations",
      content: [
        "Yellow Fever certificate required when traveling between endemic countries.",
        "Malaria prevention recommended for safari regions.",
        "Routine vaccinations advised (Tetanus, Hepatitis A/B, Typhoid).",
        "Carry personal medication and prescriptions.",
      ],
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Currency & Payments",
      content: [
        "Kenya: Kenyan Shilling (KES)",
        "Uganda: Ugandan Shilling (UGX)",
        "Tanzania: Tanzanian Shilling (TZS)",
        "USD widely accepted for tourism (newer notes preferred).",
        "Visa & Mastercard accepted in most hotels/lodges.",
      ],
    },
    {
      icon: <FaShieldAlt />,
      title: "Safety Tips",
      content: [
        "Use registered guides and operators.",
        "Avoid displaying valuables in cities.",
        "Follow park ranger instructions during safaris.",
        "Keep copies of passports and insurance documents.",
      ],
    },
    {
      icon: <FaCloudSun />,
      title: "Best Time To Travel",
      content: [
        "June–October: Dry season, ideal for wildlife viewing.",
        "December–March: Good for safaris and beach holidays.",
        "April–May: Rainy season in many regions.",
      ],
    },
    {
      icon: <FaWifi />,
      title: "Connectivity",
      content: [
        "SIM cards available at airports.",
        "Popular providers: Safaricom, Airtel, MTN.",
        "Hotels and lodges usually provide WiFi.",
      ],
    },
    {
      icon: <FaCar />,
      title: "Transport & Border Crossings",
      content: [
        "Road travel between Kenya, Uganda & Tanzania possible.",
        "Carry passport and visa documentation.",
        "Border processing times vary.",
        "Domestic flights common for safari routes.",
      ],
    },
    {
      icon: <FaPhone />,
      title: "Emergency Contacts",
      content: [
        "Kenya Emergency: 999 / 112",
        "Uganda Emergency: 999",
        "Tanzania Emergency: 112",
        "Always have your embassy contacts available.",
      ],
    },
  ];

  return (
    <main className="bg-neutral-50 min-h-screen">

      {/* HERO */}
      <section className="relative h-[60vh] bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/images/img1.webp')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 text-center max-w-4xl px-6 py-12">
          <div className="flex justify-center mb-5 text-5xl">
            <FaGlobeAfrica />
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Practical Travel Information
          </h1>

          <p className="text-lg text-gray-200">
            Essential guidance for travelers visiting Kenya,
            Uganda and Tanzania — visas, vaccinations,
            safety tips, currencies and more.
          </p>
        </div>
      </section>


      {/* INTRO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Before You Travel
          </h2>

          <p className="text-gray-600 leading-8">
            Entry requirements, vaccination rules and travel
            advisories may change over time. Always confirm
            with official government sources before departure.
            The information below provides general guidance
            for East African travel.
          </p>
        </div>


        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {sections.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-7"
            >
              <div className="text-3xl text-green-700 mb-4">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl mb-4 text-gray-800">
                {item.title}
              </h3>

              <ul className="space-y-3 text-gray-600">
                {item.content.map((text, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </section>


      {/* BORDER CROSSING TABLE */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <div className="p-8 border-b">
            <h2 className="text-3xl font-bold text-gray-800">
              Cross-Border Travel Overview
            </h2>
          </div>

          <table className="w-full">

            <thead className="bg-neutral-100">
              <tr>
                <th className="p-4 text-left text-gray-800">Route</th>
                <th className="p-4 text-left text-gray-800">Visa</th>
                <th className="p-4 text-left text-gray-800">Vaccination</th>
                <th className="p-4 text-left text-gray-800">Notes</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t">
                <td className="p-4 text-gray-800">Kenya → Uganda</td>
                <td className="p-4 text-gray-800">
                  East Africa Visa accepted
                </td>
                <td className="p-4 text-gray-800">
                  Yellow Fever may be required
                </td>
                <td className="p-4 text-gray-800">
                  Border queues vary
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4 text-gray-800">Kenya → Tanzania</td>
                <td className="p-4 text-gray-800">
                  Separate Tanzania visa often needed
                </td>
                <td className="p-4 text-gray-800">
                  Yellow Fever rules may apply
                </td>
                <td className="p-4 text-gray-800">
                  Passport required
                </td>
              </tr>

              <tr className="border-t">
                <td className="p-4 text-gray-800">Uganda → Tanzania</td>
                <td className="p-4 text-gray-800">
                  Separate entry requirements
                </td>
                <td className="p-4 text-gray-800">
                  Check latest advisories
                </td>
                <td className="p-4 text-gray-800">
                  Flights commonly preferred
                </td>
              </tr>

            </tbody>

          </table>

        </div>
      </section>

    </main>
  );
}