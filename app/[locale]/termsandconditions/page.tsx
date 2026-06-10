export default function TermsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold mb-10">
        Terms & Conditions
      </h1>

      <p className="text-gray-600 mb-12">
        Last updated: May 2026
      </p>


      <section className="space-y-10">

        <div>
          <h2 className="text-2xl font-bold">
            1. Booking Confirmation
          </h2>

          <p>
            Bookings become confirmed only after receipt of
            deposit/payment and written confirmation.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            2. Deposits & Payments
          </h2>

          <ul className="list-disc pl-6">
            <li>Deposit required to secure bookings.</li>
            <li>Remaining balance payable before travel.</li>
            <li>Late payment may lead to cancellation.</li>
          </ul>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            3. Cancellation Policy
          </h2>

          <ul className="list-disc pl-6">

            <li>60+ days → full refund less admin fees</li>

            <li>30–59 days → partial refund</li>

            <li>0–29 days → non-refundable unless specified</li>

          </ul>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            4. Changes To Itinerary
          </h2>

          <p>
            Routes, accommodation or activities may change due
            to weather, government restrictions, safety concerns,
            wildlife movement or operational needs.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            5. Passports & Visas
          </h2>

          <p>
            Guests are responsible for ensuring valid passports,
            visas and entry requirements.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            6. Health Requirements
          </h2>

          <p>
            Travelers are responsible for vaccinations,
            medications and medical suitability.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            7. Travel Insurance
          </h2>

          <p>
            Comprehensive insurance covering cancellation,
            evacuation and medical emergencies is strongly
            recommended.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            8. Wildlife & Safari Risks
          </h2>

          <p>
            Safari activities involve inherent risks.
            Participants must follow guides’ instructions.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            9. Limitation Of Liability
          </h2>

          <p>
            The company is not liable for injury, loss,
            delays, theft, weather disruptions or acts
            outside reasonable control.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            10. Force Majeure
          </h2>

          <p>
            Includes pandemics, political instability,
            strikes, war, natural disasters etc.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            11. Photography Consent
          </h2>

          <p>
            Images captured during tours may be used for
            marketing unless participants opt out.
          </p>
        </div>


        <div>
          <h2 className="text-2xl font-bold">
            12. Governing Law
          </h2>

          <p>
            Governed by laws applicable in the country
            where the company is registered.
          </p>
        </div>

      </section>

    </main>
  );
}