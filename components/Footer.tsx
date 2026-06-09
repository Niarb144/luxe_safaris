import FooterBottomBar from "./FooterBottomBar";
import { FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { T } from "./T";

export default function Footer() {
  return (
    <footer className="bg-[#b77e24] text-white mt-0">
      {/* Newsletter Section */}
      <div className="relative bg-[url('/images/img3.webp')] bg-cover bg-center">
        <div className="bg-black/50">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold">
                <T text="Want to receive travel news and inspiration?" />
              </h2>
              <p className="text-sm opacity-90">
                <T text="Sign up to our newsletter and enter our lucky draw." />
              </p>
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-md text-black w-full md:w-64 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#b77e24]"
              />
              <button className="bg-[#b77e24] px-5 py-2 rounded-md font-medium hover:bg-orange-700 transition">
                <T text="Sign me up" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1 */}
        <div>
          <h3 className="font-bold text-lg mb-4">
            LUXE PLAINS AFRICA SAFARIS
          </h3>
          <p className="text-sm mb-2">
            <FaPhoneAlt className="inline mr-2" />
            +254 719 136 129
          </p>
          <p className="text-sm mb-2">
            <FaEnvelope className="inline mr-2" />
            info@luxeafricasafaris.com
          </p>
          <p className="text-sm">
            <FaClock className="inline mr-2" />
             Mon–Fri: 09:00 – 17:00
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-4">
            <T text="About Luxe Plains Africa Safaris" />
          </h3>
          <p className="text-sm">
            <T text="Luxe Plains Africa Safaris Ltd." />
          </p>
          <p className="text-sm">
            <T text="Registered in Kenya" />
          </p>

          <p className="text-sm mt-3 leading-relaxed">
            <T text="Registered Office: Standard Building," />
            <br />
            <T text="3rd Floor, Suite No.5" />
            <br />
            Nairobi
          </p>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-4">
            <T text="Information" />
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">
              <T text="Book With Confidence" />
            </li>
            <li className="hover:underline cursor-pointer">
              <a href="/privacy-policy">
                <T text="Privacy Policy" />
              </a>
            </li>
            <li className="hover:underline cursor-pointer">
              <a href="/termsandconditions">
                <T text="Terms & Conditions" />
              </a>
            </li>
            <li className="hover:underline cursor-pointer">
              <T text="Online Payment" />
            </li>
          </ul>
        </div>

        {/* ACCREDITATIONS (replaces Service) */}
        <div>
          <h3 className="font-semibold mb-4">
            <T text="Accreditations" />
          </h3>

          <div className="grid grid-cols-2 gap-3">
            
            {/* TripAdvisor */}
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <img
                src="/images/tripadvisor.png"
                alt="Tripadvisor"
                className="h-6 object-contain"
              />
            </div>

            {/* Safari Bookings */}
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <img
                src="/images/safaribookings.png"
                alt="Safari Bookings"
                className="h-6 object-contain"
              />
            </div>

            {/* TRA */}
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <img
                src="/images/Logo-TRA.png"
                alt="TRA"
                className="h-6 object-contain"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <FooterBottomBar />
    </footer>
  );
}