import { getTranslations } from 'next-intl/server';
import Navigation from '../../components/Navigation';
import ForeignSupport from '../../components/ForeignSupport';
import Footer from '../../components/Footer';

export async function generateMetadata() {
  const t = await getTranslations('foreignSupport');
  
  return {
    title: `${t('title')} | Uni-Co 株式会社`,
    description: t('subtitle'),
  };
}

export default async function ForeignSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ForeignSupport />
      <Footer />
    </div>
  );
}

