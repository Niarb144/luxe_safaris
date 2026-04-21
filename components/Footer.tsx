// ================= FOOTER COMPONENT =================

export default function Footer() {
  return (
    <footer className="bg-orange-600 text-white mt-20">
      {/* Newsletter Section */}
      <div className="relative bg-[url('/hero.jpg')] bg-cover bg-center">
        <div className="bg-black/50">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold">
                Want to receive travel news and inspiration?
              </h2>
              <p className="text-sm opacity-90">
                Sign-up to our newsletter and enter our lucky draw.
              </p>
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-md text-black w-full md:w-64"
              />
              <button className="bg-orange-500 px-5 py-2 rounded-md font-medium hover:bg-orange-700 transition">
                Sign me up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="font-bold text-lg mb-4">LUXE PLAINS SAFARIS</h3>
          <p className="text-sm mb-2">📞 01279 704 135</p>
          <p className="text-sm mb-2">✉️ info@luxeplainsafricasafaris.com</p>
          <p className="text-sm">🕒 Mon–Thu: 09–15 | Fri: 09–13</p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-4">About Luxe PLains Safaris</h3>
          <p className="text-sm">Luxe PLains Safaris Ltd.</p>
          <p className="text-sm">Registered in Kenya</p>
          <p className="text-sm mt-2">
            Registered Office: Nucleus House,
            <br />2 Lower Mortlake Road,
            <br />Richmond
          </p>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-4">Information</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Book With Confidence</li>
            <li className="hover:underline cursor-pointer">Sustainability</li>
            <li className="hover:underline cursor-pointer">Terms & Conditions</li>
            <li className="hover:underline cursor-pointer">Online Payment</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Service</h3>
          <div className="space-y-3">
            <div className="bg-white/20 px-4 py-2 rounded-md text-sm">
              ⭐⭐⭐⭐⭐ Trustpilot
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-md text-sm">
              📱 Travel App
            </div>
            <div className="flex gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-md text-xs">ATOL</span>
              <span className="bg-white/20 px-3 py-1 rounded-md text-xs">ABTA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 text-sm px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <p>© {new Date().getFullYear()} Luxe PLains Safaris.</p>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline">Cookie settings</span>
          <span className="cursor-pointer hover:underline">Privacy policy</span>
        </div>
      </div>
    </footer>
  );
}