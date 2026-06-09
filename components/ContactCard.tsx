"use client";

import Link from "next/link";

export default function ContactCard() {
    return (
        
      <section className="py-24 bg-[#041f0e] text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#2d241a] to-[#15110c] p-10 md:p-16 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#b77e24]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#b77e24]/10 rounded-full blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="uppercase tracking-[0.3em] text-sm text-[#d4a54b] font-medium">Need Assistance?</p>
                <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                  Have Any Inquiries?<br />Feel Free To Reach Out
                </h2>
                <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-xl">
                  Our safari specialists are ready to help you plan the perfect African adventure. Whether you need custom itineraries, pricing details, or travel guidance, we're here to assist you every step of the way.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-8 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#d4a54b]">Call Us</p>
                  <a href="tel:+254719136129" className="mt-2 block text-3xl font-semibold hover:text-[#d4a54b] transition">+254 719 136 129</a>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm uppercase tracking-widest text-[#d4a54b]">Email</p>
                  <a href="mailto:info@luxesafaris.com" className="mt-2 block text-lg text-gray-200 hover:text-[#d4a54b] transition">info@luxeplainsafricasafaris.com</a>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm uppercase tracking-widest text-[#d4a54b]">Office Hours</p>
                  <p className="mt-2 text-gray-300">Monday – Friday<br />8:00 AM – 6:00 PM</p>
                </div>
                <Link href="/contact" className="w-full mt-4 bg-[#b77e24] hover:bg-[#a06d1f] transition text-white py-4 px-6 rounded-xl font-semibold text-md shadow-lg block text-center">
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }