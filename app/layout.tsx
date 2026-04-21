import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTopButton";


export const metadata: Metadata = {
  title: "Luxe Plains Africa Safaris",
  description: "Luxe Plains Africa Safaris is a premier safari company specializing in luxury travel experiences across Africa. We offer bespoke safari packages that combine opulence with the raw beauty of the African wilderness, ensuring unforgettable adventures for our discerning clientele.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
