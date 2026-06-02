import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLoaderWrapper from "@/components/ClientLoaderWrapper";
import WhatsAppButton from "@/components/WhatsappFloatingButton";
import { ScrollToTop } from "@/components/ScrollToTopButton";
import { Suspense } from "react";
import NavigationProgress from "@/components/NavigationProgress";
import CookieBanner from "@/components/CookieBanner"; 
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ConsentProvider } from "@/components/ConsentProvider";
import Providers from "@/app/providers";


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

        <ClientLoaderWrapper>
          <ConsentProvider>
            <Providers>
            <Navbar />
              <Suspense fallback={null}>
                <NavigationProgress />
              </Suspense>
              {children}
              <Footer />
            <ScrollToTop />
            <WhatsAppButton />
            <CookieBanner />
            <GoogleAnalytics />
            </Providers>
          </ConsentProvider>
        </ClientLoaderWrapper>
        
      </body>
    </html>
  );
}
