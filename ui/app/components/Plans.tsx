'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { api, type Service } from '@/lib/api';
import AnimateOnView from './AnimateOnView';

export default function Plans() {
  const t = useTranslations('services');
  const params = useParams();
  const locale = (params?.locale as string) || 'jp';

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await api.getServices(true, locale);
        setServices(servicesData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [locale]);

  return (
    <section id="services" className="py-20 md:py-28 lg:py-40 bg-gradient-to-b from-white via-stone-50/30 to-white relative overflow-hidden pattern-grid">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="text-center mb-14 md:mb-20 lg:mb-28">
          <span className="text-xs font-medium text-amber-700 tracking-[0.2em] uppercase block mb-4 md:mb-6">
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight text-gray-900 mb-6 md:mb-8 tracking-tighter leading-[1.05] px-4">
            {t('title')}
          </h2>
          <div className="w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6 md:mb-8" />
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed px-4">
            {t('subtitle')}
          </p>
        </AnimateOnView>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-gradient-to-br from-amber-50/50 via-stone-50 to-white border border-amber-200/40 p-8 md:p-10 lg:p-12 animate-pulse">
                <div className="h-14 w-14 bg-amber-100/60 rounded-2xl mb-6" />
                <div className="h-7 bg-gray-200 rounded mb-4 w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6 mt-2" />
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => {
              const firstImage = service.images?.[0];

              return (
                <AnimateOnView key={service.id} stagger={index + 1}>
                <div
                  className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200/80 hover:border-amber-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

                  {firstImage && (
                    <div className="relative h-52 md:h-56 overflow-hidden">
                      <Image
                        src={firstImage}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={firstImage.includes('unsplash.com') || firstImage.includes('r2.cloudflarestorage.com')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                    </div>
                  )}

                  <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 mb-3 md:mb-4 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                </AnimateOnView>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-light">{t('noServices') || 'No services available'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
