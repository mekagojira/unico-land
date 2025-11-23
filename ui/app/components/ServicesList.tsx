'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function ServicesList() {
  const t = useTranslations('services');

  const services = [
    {
      id: 'sales',
      icon: '🏛️',
      gradient: 'from-blue-50 via-blue-100/50 to-white',
      borderColor: 'border-blue-200/50',
      hoverBorder: 'hover:border-blue-300',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90',
    },
    {
      id: 'rental',
      icon: '🔑',
      gradient: 'from-blue-50 via-blue-100/50 to-white',
      borderColor: 'border-blue-200/50',
      hoverBorder: 'hover:border-blue-300',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=90',
    },
    {
      id: 'management',
      icon: '📊',
      gradient: 'from-blue-50 via-blue-100/50 to-white',
      borderColor: 'border-blue-200/50',
      hoverBorder: 'hover:border-blue-300',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=90',
    },
    {
      id: 'foreignSupport',
      icon: '🌍',
      gradient: 'from-blue-50 via-blue-100/50 to-white',
      borderColor: 'border-blue-200/50',
      hoverBorder: 'hover:border-blue-300',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=90',
    },
  ];

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-white via-stone-50/20 to-white relative overflow-hidden">
      {/* Luxury background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20zM40 40h20v20H40zM60 60h20v20H60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <div className="inline-block mb-4 md:mb-6">
            <span className="text-xs font-medium text-blue-700 tracking-[0.2em] uppercase">
              {t('badge')}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-gray-900 mb-6 md:mb-8 tracking-tighter leading-[1.05] px-4">
            {t('title')}
          </h1>
          <div className="w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6 md:mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed px-4">
            {t('subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/service/${service.id}`}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-stone-50/50 border border-gray-200/50 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-3"
            >
              {/* Luxury shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] z-10"></div>
              
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={service.image}
                  alt={t(`${service.id}.title`)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={service.image.includes('unsplash.com')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Icon overlay */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="text-5xl md:text-6xl transform group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-8 md:p-10 lg:p-12">
                <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 tracking-tight">
                  {t(`${service.id}.title`)}
                </h3>
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed mb-6">
                  {t(`${service.id}.description`)}
                </p>
                
                {/* CTA Link */}
                <div className="flex items-center text-blue-700 font-medium group-hover:text-blue-800 transition-colors">
                  <span className="text-sm md:text-base tracking-wide">
                    {t('viewMore')}
                  </span>
                  <svg 
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 md:mt-24 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-lg md:text-xl text-gray-700 font-light mb-6 max-w-2xl">
              {t('subtitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 md:px-12 py-5 md:py-6 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white font-medium rounded-lg hover:from-blue-900 hover:via-blue-800 hover:to-blue-700 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-900/30 tracking-wide"
            >
              {t('ctaContact')}
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

