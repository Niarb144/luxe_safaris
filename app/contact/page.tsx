"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const contacts = [
  {
    name: "Customer Support",
    phone: "+254 712 345678",
    role: "General inquiries & bookings",
  },
  {
    name: "Safari Specialist",
    phone: "+254 798 765432",
    role: "Custom safari planning",
  },
  {
    name: "Emergency Line",
    phone: "+254 700 111222",
    role: "24/7 urgent support",
  },
];

export default function ContactPage() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10">
      
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Contact Us
        </h1>
        <p className="text-gray-500 mt-2">
          Plan your next adventure with our team
        </p>
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* LEFT: FORM */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* RIGHT: MAP */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden shadow-sm"
        >
          <iframe
            src="https://www.google.com/maps?q=Nairobi%20Kenya&output=embed"
            className="w-full h-full min-h-[350px] border-0"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* CONTACT CARDS */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Reach Us Directly
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {contacts.map((contact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <Phone className="text-orange-500" />
                <h3 className="font-semibold">{contact.name}</h3>
              </div>

              <p className="text-gray-500 text-sm mb-2">
                {contact.role}
              </p>

              <a
                href={`tel:${contact.phone}`}
                className="text-orange-500 font-medium"
              >
                {contact.phone}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EXTRA INFO */}
      <div className="mt-12 text-center text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <MapPin size={18} />
          Nairobi, Kenya
        </div>

        <div className="flex justify-center items-center gap-2 mt-2">
          <Mail size={18} />
          info@luxeplainsafricasafaris.com
        </div>
      </div>
    </div>

    </>
      );
}