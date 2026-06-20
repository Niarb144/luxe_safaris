import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BookingConfidence from '@/components/BookingWithConfidence';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('BookingConfidence');
  return {
    title: `${t('hero.title')} | Luxe Plains Africa Safaris`,
    description: t('hero.subtitle'),
  };
}

export default function BookingWithConfidencePage() {
  return <BookingConfidence />;
}