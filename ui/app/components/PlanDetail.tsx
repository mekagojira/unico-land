import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

interface PlanDetailProps {
  planId: string;
}

export default function PlanDetail({ planId }: PlanDetailProps) {
  const t = useTranslations('services');
  const planT = useTranslations(`services.${planId}`);

  const planImages = {
    simple: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=90',
    ],
    natural: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90', 
    ],
    designers: [ 
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90',
    ],
  };

  const images = planImages[planId as keyof typeof planImages] || planImages.simple;

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-white relative overflow-hidden">
      {/* Luxury background pattern */}
      <div className="absolute inset-0 opacity-[0.01]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-59-19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23000000' fill-opacity='1'/%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="text-xs font-medium text-blue-700 tracking-[0.2em] uppercase">{t('badge')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-gray-900 mb-6 tracking-tighter leading-[1.05]">
            {planT('title')}
          </h1>
          <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            {planT('description')}
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative aspect-[21/9]">
            <Image
              src={images[0]}
              alt={planT('title')}
              fill
              className="object-cover"
              quality={95}
              priority
              sizes="100vw"
              unoptimized={images[0].includes('unsplash.com')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {images.slice(1).map((image, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-xl group">
              <div className="relative aspect-[4/3]">
                <Image
                  src={image}
                  alt={`${planT('title')} - ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={image.includes('unsplash.com')}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Plan Details */}
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-stone-50/30 rounded-3xl border border-blue-100/50 p-12 md:p-16 mb-16">
          <h2 className="text-3xl md:text-4xl font-extralight text-gray-900 mb-8 tracking-tight">
            {t('detailTitle')}
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light mb-6">
              {planT('detail1')}
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light mb-6">
              {planT('detail2')}
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
              {planT('detail3')}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white font-medium rounded-lg hover:from-blue-900 hover:via-blue-800 hover:to-blue-700 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-900/30 tracking-wide"
          >
            {t('ctaContact')}
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

