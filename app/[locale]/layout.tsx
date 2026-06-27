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
  title: "Luxe Plains Africa Safaris",
  description: "Luxe Plains Africa Safaris is a premier safari company...",
}

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