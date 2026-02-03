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
        <div className="absolute inset-0 z-10 hero-overlay" />
        <div className="absolute inset-0 z-10 hero-grain" aria-hidden />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-48 md:pt-0">
          <div className="text-center max-w-5xl mx-auto">
            <div className="hero-reveal inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 mb-6 md:mb-8 bg-white/95 backdrop-blur-md border border-amber-200/60 rounded-full shadow-lg shadow-amber-900/10">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-amber-800 tracking-[0.2em] uppercase">
                {t('badge')}
              </span>
            </div>

            <h1 className="hero-reveal hero-reveal-delay-1 hero-glow text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight text-white mb-6 md:mb-8 leading-[1.1] tracking-tight px-4">
              {t('title')}
              <br />
              <span className="font-light bg-gradient-to-r from-amber-200 via-amber-100 to-amber-50 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                {t('titleHighlight')}
              </span>
            </h1>

            <p className="hero-reveal hero-reveal-delay-2 text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 md:mb-12 leading-relaxed font-light max-w-4xl mx-auto drop-shadow-lg px-4">
              {t('subtitle')}
            </p>

            <div className="max-w-4xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6 px-4">
              <div className="hero-reveal hero-reveal-delay-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 md:p-8 text-left">
                <p className="text-sm sm:text-base text-white/95 leading-relaxed font-light">
                  {t('description1')}
                </p>
              </div>
              <div className="hero-reveal hero-reveal-delay-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 md:p-8 text-left">
                <p className="text-sm sm:text-base text-white/95 leading-relaxed font-light">
                  {t('description2')}
                </p>
              </div>
              {t('description3') && (
                <div className="hero-reveal hero-reveal-delay-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 md:p-8 text-left">
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-light">
                    {t('description3')}
                  </p>
                </div>
              )}
            </div>

            <div className="hero-reveal hero-reveal-delay-6 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4 pb-8">
              <Link
                href="/company"
                className="group relative inline-flex items-center justify-center px-8 sm:px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-amber-700 to-amber-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-amber-800 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-amber-900/30 tracking-wide overflow-hidden w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative z-10">{t('ctaAbout')}</span>
                <svg className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 sm:px-10 md:px-12 py-4 md:py-5 bg-white/95 backdrop-blur-md text-gray-900 text-sm sm:text-base font-medium rounded-xl border-2 border-white/50 hover:border-amber-300 hover:text-amber-800 transition-all duration-300 shadow-xl tracking-wide w-full sm:w-auto"
              >
                {t('ctaServices')}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint: right side so it doesn’t overlap slideshow dots */}
        <div className="absolute bottom-8 right-6 md:right-10 z-20 flex flex-col items-center gap-2 animate-float" aria-hidden>
          <span className="text-[10px] md:text-xs text-white/60 font-light tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    </>
  );
}
