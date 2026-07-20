import FooterBottomBar from "./FooterBottomBar";
import NewsletterForm from "./NewsLetterForm";
import { FaPhoneAlt, FaEnvelope, FaClock, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-[#b77e24] text-white mt-0">
      {/* Newsletter Section */}
      <div className="relative bg-[url('/images/img3.webp')] bg-cover bg-center">
        <div className="bg-black/50">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold">
                {t("newsletter.title")}
              </h2>
              <p className="text-sm opacity-90">
                {t("newsletter.subtitle")}
              </p>
            </div>

            <NewsletterForm locale={locale} />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Column 1 */}
        <div>
          <h3 className="font-bold text-lg mb-4">
            {t("company.name")}
          </h3>
          <p className="text-sm mb-2">
            <FaPhoneAlt className="inline mr-2" />
            +254 716 686 006
          </p>
          <p className="text-sm mb-2">
            <FaEnvelope className="inline mr-2" />
            info@luxeplainsafricasafaris.com
          </p>
          <p className="text-sm">
            <FaClock className="inline mr-2" />
            Mon–Fri: 08:00 – 17:00
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-4">
            {t("company.about")}
          </h3>
          <p className="text-sm">{t("company.registered")}</p>
          <p className="text-sm">{t("company.country")}</p>
          <p className="text-sm mt-3 leading-relaxed">
            {t("company.address1")}
            <br />
            {t("company.address2")}
            <br />
            Nairobi
          </p>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-4">
            {t("information.title")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">
              <a href="/booking-with-confidence">{t("information.bookWithConfidence")}</a>
            </li>
            <li className="hover:underline cursor-pointer">
              <a href="/privacy-policy">{t("information.privacyPolicy")}</a>
            </li>
            <li className="hover:underline cursor-pointer">
              <a href="/termsandconditions">{t("information.termsAndConditions")}</a>
            </li>
            {/* <li className="hover:underline cursor-pointer">
              <a href="/payment-methods">{t("information.onlinePayment")}</a>
            </li> */}
          </ul>
        </div>

        {/* Accreditations */}
        {/* <div>
          <h3 className="font-semibold mb-4">
            {t("accreditations.title")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <img src="/images/tripadvisor.png" alt="Tripadvisor" className="h-6 object-contain" />
            </div>
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <img src="/images/safaribookings.png" alt="Safari Bookings" className="h-6 object-contain" />
            </div>
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <img src="/images/Logo-TRA.png" alt="TRA" className="h-6 object-contain" />
            </div>
          </div>
        </div> */}

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4">
            {t("social.title")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <a href="https://www.instagram.com/luxeplainsafrica/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl" />
              </a>
            </div>
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <a href="https://www.tiktok.com/@luxeplainsafrica" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="text-2xl" />
              </a>
            </div>
            <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center hover:bg-white/30 transition">
              <a href="https://www.facebook.com/luxeplainsafrica" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <FooterBottomBar />
    </footer>
  );
}