'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import LuxuryGallery from '../components/LuxuryGallery';
import About from '../components/About';
import Services from '../components/Plans';
import Blog from '../components/Blog';
import News from '../components/News';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import { api, type CompanyInfo } from '@/lib/api';
import { getCachedData, CacheKeys } from '@/lib/cache';

// Disable SSR for this page to prevent hydration mismatches
const HomePageContent = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    // Only read from localStorage after component mounts (client-side only)
    const cachedData = getCachedData<CompanyInfo>(CacheKeys.COMPANY_INFO);
    if (cachedData) {
      setCompanyInfo(cachedData);
    }

    // Fetch company info for footer (will use cache if available)
    api.getCompanyInfo()
      .then(setCompanyInfo)
      .catch(() => {
        // Silently fail - footer will use translations as fallback
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <LuxuryGallery />
      <About />
      <Services />
      <Blog />
      <News />
      <Footer companyInfo={companyInfo} />
    </div>
  );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(HomePageContent), {
  ssr: false,
});

