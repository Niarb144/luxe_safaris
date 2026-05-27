export default function PrivacyPolicy() {
  return (
    <main className="max-w-5xl mx-auto py-20 px-6">

      <h1 className="text-5xl font-bold mb-8">
        Privacy Policy
      </h1>

      <p className="text-gray-600 mb-12">
        Last updated: May 2026
      </p>


      <section className="space-y-10">

        <div>
          <h2 className="font-bold text-2xl">
            Information We Collect
          </h2>

          <ul className="list-disc pl-6">

            <li>Name</li>

            <li>Email</li>

            <li>Phone number</li>

            <li>Passport details (when required)</li>

            <li>Booking information</li>

            <li>Payment metadata</li>

            <li>Device/browser information</li>

          </ul>
        </div>


        <div>
          <h2 className="font-bold text-2xl">
            Why We Collect Data
          </h2>

          <ul className="list-disc pl-6">

            <li>Process bookings</li>

            <li>Customer support</li>

            <li>Marketing newsletters</li>

            <li>Improve services</li>

            <li>Legal compliance</li>

          </ul>
        </div>


        <div>
          <h2 className="font-bold text-2xl">
            Cookies
          </h2>

          <p>
            We use essential, analytics and marketing cookies.
            Users can customise preferences.
          </p>
        </div>


        <div>
          <h2 className="font-bold text-2xl">
            Third Parties
          </h2>

          <p>
            Google Analytics, Meta Pixel, Stripe, Resend,
            Supabase and other providers may process limited data.
          </p>
        </div>


        <div>
          <h2 className="font-bold text-2xl">
            User Rights
          </h2>

          <ul className="list-disc pl-6">

            <li>Access your data</li>

            <li>Delete data</li>

            <li>Correct inaccuracies</li>

            <li>Withdraw consent</li>

          </ul>

        </div>

      </section>

    </main>
  );
}