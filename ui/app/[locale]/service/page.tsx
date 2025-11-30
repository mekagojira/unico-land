'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
import ServicesList from '../../components/ServicesList';
import Footer from '../../components/Footer';
import { api, type Service, type CompanyInfo } from '@/lib/api';
import { getCachedData, CacheKeys } from '@/lib/cache';

// Disable SSR for this page to prevent hydration mismatches
const ServicesPageContent = () => {
  const params = useParams();
  const locale = (params?.locale as string) || 'jp';
  
  const [services, setServices] = useState<Service[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only read from localStorage after component mounts (client-side only)
    const cachedServices = getCachedData<Service[]>(CacheKeys.SERVICES(locale, true));
    const cachedCompany = getCachedData<CompanyInfo>(CacheKeys.COMPANY_INFO);
    
    if (cachedServices) {
      setServices(cachedServices);
    }
    if (cachedCompany) {
      setCompanyInfo(cachedCompany);
    }
    
    // If we have cached data, we can show it immediately
    if (cachedServices || cachedCompany) {
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        // These will use cache if available, or fetch and cache
        const [servicesData, companyData] = await Promise.all([
          api.getServices(true, locale).catch(() => []),
          api.getCompanyInfo().catch(() => null),
        ]);
        
        setServices(servicesData);
        setCompanyInfo(companyData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    // If we have cached data, fetch in background to update cache
    // Otherwise, fetch immediately
    if (cachedServices || cachedCompany) {
      fetchData(); // Fetch in background to refresh cache
    } else {
      fetchData(); // Fetch immediately if no cache
    }
  }, [locale]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          <ServicesList services={services} />
          <Footer companyInfo={companyInfo} />
        </>
      )}
    </div>
  );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(ServicesPageContent), {
  ssr: false,
});

