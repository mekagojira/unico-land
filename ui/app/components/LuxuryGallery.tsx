import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function LuxuryGallery() {
  const t = useTranslations('services');

  const services = [
    {
      id: 'sales',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=90',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'rental',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=90',
      aspect: 'aspect-[4/3]',
    }, 
    {
      id: 'foreignSupport',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90',
      aspect: 'aspect-[4/3]',
    },
    {
      id: 'management',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90',
      aspect: 'aspect-[4/3]',
    },
  ];

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Ultra-subtle luxury pattern */}
      <div className="absolute inset-0 opacity-[0.008]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-59-19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23000000' fill-opacity='1'/%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <span className="text-xs font-medium text-gray-400 tracking-[0.3em] uppercase mb-2 block">
                {t('badge')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-gray-900 tracking-tighter">
                {t('title')}
              </h2>
            </div>
            <div className="hidden md:block w-32 h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
        </div>

        {/* Luxury Magazine Grid - Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Link
              key={`${service.id}-${index}`}
              href={`/service/${service.id}`}
              className={`${service.aspect} group relative overflow-hidden bg-gray-100 cursor-pointer block rounded-2xl`}
            >
              <div className="absolute inset-0">
                <Image
                  src={service.image}
                  alt={t(`${service.id}.title`)}
                  fill
                  className="object-cover transition-all duration-[1000ms] ease-out group-hover:scale-105"
                  quality={95}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  unoptimized={service.image.includes('unsplash.com')}
                />
                
                {/* Sophisticated gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/0 via-transparent to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Subtle vignette effect */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5"></div>
              </div>

              {/* Elegant content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10 z-10">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                  <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extralight text-white leading-[1.2] tracking-tight mb-2">
                    {t(`${service.id}.title`)}
                  </h3>
                  <p className="text-sm md:text-base text-white/80 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {t(`${service.id}.description`)}
                  </p>
                </div>
              </div>

              {/* Luxury border on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-blue-400/40 transition-all duration-700 rounded-2xl"></div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </Link>
          ))}
        </div>

        {/* Elegant View More */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="#services"
            className="inline-flex items-center gap-2 text-gray-700 font-light text-sm md:text-base hover:text-blue-700 transition-colors tracking-wide group"
          >
            <span className="border-b border-transparent group-hover:border-blue-700 transition-colors">
              {t('viewMore')}
            </span>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
