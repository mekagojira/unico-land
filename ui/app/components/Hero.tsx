'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HeroSlideshow from './HeroSlideshow';
import LoadingScreen from './LoadingScreen';
import { heroImages, isImageCached } from '@/app/utils/imagePreloader';

export default function Hero() {
  const t = useTranslations('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (heroImages.every((img) => isImageCached(img.url))) {
      setIsLoading(false);
      setLoadingProgress(100);
    }
  }, []);

  const handleLoadingChange = (loading: boolean, progress: number) => {
    setIsLoading(loading);
    setLoadingProgress(progress);
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} progress={loadingProgress} />
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroSlideshow onLoadingChange={handleLoadingChange} />
        </div>
        {/* Stronger overlay for better text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="absolute inset-0 z-10 hero-grain" aria-hidden />

        <div className="relative z-20 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-32 sm:pt-36 md:pt-0">
          <div className="text-center">
            {/* Main Heading - Clean, Bold, Readable */}
            <h1 className="hero-reveal hero-reveal-delay-1 mb-6 sm:mb-8">
              <span 
                className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.15] tracking-tight"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                {t('title')}
              </span>
              <span 
                className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mt-2 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100 bg-clip-text text-transparent"
                style={{ textShadow: '0 0 40px rgba(251,191,36,0.3)' }}
              >
                {t('titleHighlight')}
              </span>
            </h1>

            {/* Subtitle - Clear and Prominent */}
            <p 
              className="hero-reveal hero-reveal-delay-2 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-light mb-10 sm:mb-12 md:mb-14 leading-relaxed max-w-3xl mx-auto"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}
            >
              {t('subtitle')}
            </p>

            {/* Description Card - Single, Clean Box */}
            <div className="hero-reveal hero-reveal-delay-3 mb-10 sm:mb-12 md:mb-14 max-w-3xl mx-auto">
              <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl text-left">
                <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-4 sm:mb-5">
                  {t('description1')}
                </p>
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed font-light">
                  {t('description2')}
                </p>
              </div>
            </div>

            {/* CTA Buttons - Professional Styling */}
            <div className="hero-reveal hero-reveal-delay-4 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
              <Link
                href="/company"
                className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm sm:text-base font-medium rounded-xl hover:from-amber-700 hover:to-amber-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-amber-900/25 hover:shadow-xl hover:shadow-amber-900/30 tracking-wide overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative z-10">{t('ctaAbout')}</span>
                <svg className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-gray-900 text-sm sm:text-base font-medium rounded-xl border-2 border-transparent hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide"
              >
                {t('ctaServices')}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-6 md:right-10 z-20 flex flex-col items-center gap-2 animate-float" aria-hidden>
          <span className="text-[10px] md:text-xs text-white/50 font-light tracking-[0.2em] uppercase">Scroll</span>
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    </>
  );
}
