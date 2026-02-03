import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import AnimateOnView from './AnimateOnView';

export default function LuxuryGallery() {
  const t = useTranslations('services');

  const services = [
    { id: 'sales', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=90', aspect: 'aspect-[4/3]' },
    { id: 'rental', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=90', aspect: 'aspect-[4/3]' },
    { id: 'foreignSupport', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90', aspect: 'aspect-[4/3]' },
    { id: 'management', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90', aspect: 'aspect-[4/3]' },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden pattern-grid">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="mb-10 md:mb-14 lg:mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-medium text-amber-700 tracking-[0.25em] uppercase block mb-3">
                {t('badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-gray-900 tracking-tighter">
                {t('title')}
              </h2>
            </div>
            <div className="hidden md:block w-24 md:w-32 h-px bg-gradient-to-r from-amber-500 to-transparent" />
          </div>
        </AnimateOnView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <AnimateOnView key={`${service.id}-${index}`} stagger={index + 1} as="div">
            <Link
              key={`${service.id}-${index}`}
              href={`/service/${service.id}`}
              className={`${service.aspect} group relative overflow-hidden rounded-2xl bg-gray-100 block`}
            >
              <div className="absolute inset-0">
                <Image
                  src={service.image}
                  alt={t(`${service.id}.title`)}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={service.image.includes('unsplash.com')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/0 via-transparent to-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-extralight text-white leading-tight tracking-tight mb-2">
                    {t(`${service.id}.title`)}
                  </h3>
                  <p className="text-sm md:text-base text-white/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 line-clamp-2">
                    {t(`${service.id}.description`)}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 border border-transparent group-hover:border-amber-400/30 transition-all duration-500 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl" />
            </Link>
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView stagger={5} className="text-center mt-12 md:mt-16">
          <Link
            href="#services"
            className="inline-flex items-center gap-2 text-gray-700 font-light text-sm md:text-base hover:text-amber-700 transition-colors duration-300 tracking-wide group"
          >
            <span className="border-b border-transparent group-hover:border-amber-700 transition-colors duration-300">
              {t('viewMore')}
            </span>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600/80 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
