'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HeroSlideshow from './HeroSlideshow';
import LoadingScreen from './LoadingScreen';
import { isImageCached, heroImages } from '@/app/utils/imagePreloader';

export default function Hero() {
  const t = useTranslations('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Check if images are already cached on mount
  useEffect(() => {
    const allCached = heroImages.every((img) => isImageCached(img.url));
    if (allCached) {
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
        {/* Luxury Image Slideshow Background */}
        <div className="absolute inset-0 z-0">
          <HeroSlideshow onLoadingChange={handleLoadingChange} />
        </div>

      {/* Additional overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-48 md:pt-0">
        <div className="text-center max-w-6xl mx-auto">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 mb-6 md:mb-8 bg-white/90 backdrop-blur-md border border-blue-200/50 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700 tracking-widest uppercase">{t('badge')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-extralight text-white mb-6 md:mb-8 leading-[1.1] tracking-tight drop-shadow-2xl px-4">
            {t('title')}
            <br />
            <span className="font-light bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 md:mb-12 leading-relaxed font-light max-w-4xl mx-auto drop-shadow-lg px-4">
            {t('subtitle')}
          </p>

          {/* Description Cards */}
          <div className="max-w-5xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6 px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8 text-left">
              <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed font-light">
                {t('description1')}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8 text-left">
              <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed font-light">
                {t('description2')}
              </p>
            </div>
            
            {t('description3') && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8 text-left">
                <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed font-light">
                  {t('description3')}
                </p>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
            <Link
              href="/company"
              className="group relative inline-flex items-center justify-center px-8 sm:px-10 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:from-blue-900 hover:via-blue-800 hover:to-blue-700 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-900/50 tracking-wide overflow-hidden backdrop-blur-sm w-full sm:w-auto"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
              <span className="relative z-10">{t('ctaAbout')}</span>
              <svg className="relative z-10 ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 sm:px-10 md:px-12 py-4 md:py-6 bg-white/95 backdrop-blur-md text-gray-900 text-sm sm:text-base font-medium rounded-lg border-2 border-white/50 hover:border-blue-400 hover:text-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl tracking-wide w-full sm:w-auto"
            >
              {t('ctaServices')}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-6 h-6 text-white/80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
    </>
  );
}
