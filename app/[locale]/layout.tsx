import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n'
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ClientLoaderWrapper from "@/components/ClientLoaderWrapper"
import WhatsAppButton from "@/components/WhatsappFloatingButton"
import { ScrollToTop } from "@/components/ScrollToTopButton"
import CustomSafariButton from '@/components/CustomSafariButton'
import { Suspense } from "react"
import NavigationProgress from "@/components/NavigationProgress"
import CookieBanner from "@/components/CookieBanner"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { ConsentProvider } from "@/components/ConsentProvider"
import Providers from "@/app/[locale]/providers"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.luxeplainsafricasafaris.com"),

  title: {
    default: "Luxe Plains Africa Safaris",
    template: "%s | Luxe Plains Africa Safaris",
  },

  description:
    "Discover unforgettable luxury safaris across Kenya and East Africa with Luxe Plains Africa Safaris. Experience the Maasai Mara, Amboseli, Tsavo, Samburu, gorilla trekking, beach holidays, custom private tours, family vacations, honeymoon safaris, and authentic African adventures.",

  applicationName: "Luxe Plains Africa Safaris",

  keywords: [
    "Kenya Safaris",
    "Luxury Safaris Kenya",
    "African Safaris",
    "Safari Tours",
    "Masai Mara Safari",
    "Maasai Mara",
    "Amboseli National Park",
    "Tsavo National Park",
    "Samburu National Reserve",
    "Nairobi Tours",
    "Kenya Wildlife Safari",
    "Private Safari Kenya",
    "Luxury Tours Africa",
    "Big Five Safari",
    "Migration Safari",
    "Family Safari",
    "Honeymoon Safari",
    "East Africa Tours",
    "Custom Safari",
    "Beach Holidays Kenya",
    "Mount Kenya Trekking",
    "Travel Kenya",
    "Tour Operator Kenya",
    "African Wildlife",
  ],

  authors: [
    {
      name: "Luxe Plains Africa Safaris",
      url: "https://www.luxeplainsafricasafaris.com",
    },
  ],

  creator: "Luxe Plains Africa Safaris",
  publisher: "Luxe Plains Africa Safaris",

  category: "Travel",

  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
      de: "/de",
      es: "/es",
      it: "/it",
      ja: "/ja",
      ar: "/ar",
      zh: "/zh",
      ru: "/ru",
      pt: "/pt",
      nl: "/nl",
      pl: "/pl",
    },
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Luxury Kenya Safaris",

    description:
      "Experience luxury safaris, wildlife adventures, private tours, beach holidays, mountain trekking and tailor-made African travel across Kenya and East Africa.",

    url: "https://www.luxeplainsafricasafaris.com",

    siteName: "Luxe Plains Africa Safaris",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Kenya Safari",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Luxury Kenya Safaris",

    description:
      "Explore Kenya and East Africa with tailor-made luxury safaris.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientLoaderWrapper>
            <ConsentProvider>
              <Providers>
                <Navbar />
                <Suspense fallback={null}>
                  <NavigationProgress />
                </Suspense>
                {children}
                <Footer />
                <CustomSafariButton />
                <ScrollToTop />
                <WhatsAppButton />
                <CookieBanner />
                <GoogleAnalytics />
              </Providers>
            </ConsentProvider>
          </ClientLoaderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}