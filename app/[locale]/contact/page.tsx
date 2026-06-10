"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

const contacts = [
  {
    name: "Customer Support",
    phone: "+254 719 136 129",
    role: "General inquiries & bookings",
  },
  {
    name: "Safari Specialist",
    phone: "+254 722 486 677",
    role: "Custom safari planning",
  },
  {
    name: "Emergency Line",
    phone: "+254 719 136 129",
    role: "24/7 urgent support",
  },
];

export default function ContactPage() {
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setStatus(null);

    if (!executeRecaptcha) {
      setStatus({
        type: "error",
        message:
          "Security verification is not ready. Please try again.",
      });
      return;
    }

    try {
      setSending(true);

      const token =
        await executeRecaptcha(
          "contact_submit"
        );

      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            recaptchaToken: token,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            result.error ||
            "Failed to send message.",
        });

        return;
      }

      setStatus({
        type: "success",
        message:
          "Thank you for contacting us. We'll get back to you shortly.",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);

      setStatus({
        type: "error",
        message:
          "Something went wrong. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
    <section className="relative h-[60vh] w-full flex items-center justify-center text-center overflow-hidden">
              {/* Optimized Background Image */}
              <div className="absolute inset-0 border rounded-lg overflow-hidden">
                <Image
                  src="/images/img6.jpg"
                  alt="Safari landscape"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover border rounded-lg"
                  placeholder="blur"
                  blurDataURL="/images/img6.jpg"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
        
              {/* Content */}
              <div className="relative z-10 px-6 max-w-3xl">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-bold text-white leading-tight"
                >
                  Have a question?
                </motion.h1>
                <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-4 text-lg md:text-xl text-white/90"
                >
                 We're here to help!
                </motion.p>
              </div>
            </section>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Send us a message</h2>
          {status && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                status.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#b77e24] outline-none text-gray-800"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#b77e24] outline-none text-gray-800"
            />

            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              rows={4}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#b77e24] outline-none text-gray-800"
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#b77e24] hover:bg-[#a06b05] text-white py-3 rounded-lg transition cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending
                ? "Sending..."
                : "Send Message"}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7977.62949109927!2d36.819140673500705!3d-1.2851240356217832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6f038e9e1%3A0x40f6ec8000897b19!2sStandard%20Building!5e0!3m2!1sen!2ske!4v1780062587048!5m2!1sen!2ske"
            className="w-full h-full min-h-[350px] border-0"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* CONTACT CARDS */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
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
                <Phone className="text-[#b77e24]" />
                <h3 className="font-semibold text-gray-800">{contact.name}</h3>
              </div>

              <p className="text-gray-500 text-sm mb-2">
                {contact.role}
              </p>

              <a
                href={`tel:${contact.phone}`}
                className="text-[#b77e24] font-medium"
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