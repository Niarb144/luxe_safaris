import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PaymentMethods from '@/components/PaymentMethods';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PaymentMethods');
  return {
    title: `${t('hero.title')} | Luxe Plains Africa Safaris`,
    description: t('hero.subtitle'),
  };
}

export default function PaymentMethodsPage() {
  return <PaymentMethods />;
}