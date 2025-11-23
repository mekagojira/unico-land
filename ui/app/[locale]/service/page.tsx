import Navigation from '../../components/Navigation';
import ServicesList from '../../components/ServicesList';
import Footer from '../../components/Footer';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: t('title') + ' | Uni-Co 株式会社',
    description: t('subtitle'),
  };
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ServicesList />
      <Footer />
    </div>
  );
}

