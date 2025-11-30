'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';
import Company from '../../components/Company';
import Footer from '../../components/Footer';
import { api, type CompanyInfo } from '@/lib/api';
import { getCachedData, CacheKeys } from '@/lib/cache';

// Disable SSR for this page to prevent hydration mismatches
const CompanyPageContent = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only read from localStorage after component mounts (client-side only)
    const cachedData = getCachedData<CompanyInfo>(CacheKeys.COMPANY_INFO);
    if (cachedData) {
      setCompanyInfo(cachedData);
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        // This will use cache if available, or fetch and cache
        const data = await api.getCompanyInfo();
        setCompanyInfo(data);
      } catch (error) {
        console.error('Failed to fetch company info:', error);
        // Continue with cached data or null - component will use translations as fallback
      } finally {
        setLoading(false);
      }
    };

    // If we have cached data, fetch in background to update cache
    // Otherwise, fetch immediately
    if (cachedData) {
      fetchData(); // Fetch in background to refresh cache
    } else {
      fetchData(); // Fetch immediately if no cache
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          <Company companyInfo={companyInfo} />
          <Footer companyInfo={companyInfo} />
        </>
      )}
    </div>
  );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(CompanyPageContent), {
  ssr: false,
});
