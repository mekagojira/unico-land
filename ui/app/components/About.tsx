import { useTranslations } from 'next-intl';
import AnimateOnView from './AnimateOnView';

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-20 md:py-28 lg:py-40 bg-gradient-to-b from-white via-stone-50/40 to-white relative overflow-hidden pattern-grid">
      <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-gradient-radial from-amber-100/30 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateOnView className="text-center mb-20 md:mb-28">
          <span className="text-xs font-medium text-amber-700 tracking-[0.2em] uppercase block mb-6">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight text-gray-900 mb-8 tracking-tighter leading-[1.05]">
            {t('title')}
          </h2>
          <div className="w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </AnimateOnView>

        <AnimateOnView stagger={1} className="max-w-4xl mx-auto mb-20 md:mb-28">
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-relaxed font-extralight text-center">
            {t('description')}
          </p>
        </AnimateOnView>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
          <AnimateOnView stagger={2} className="group relative text-center p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200/80 hover:border-amber-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-4 tracking-tight">{t('feature1Title')}</h3>
              <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">{t('feature1Desc')}</p>
            </div>
          </AnimateOnView>

          <AnimateOnView stagger={3} className="group relative text-center p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200/80 hover:border-amber-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-50/0 to-stone-50/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <svg className="w-10 h-10 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-4 tracking-tight">{t('feature2Title')}</h3>
              <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">{t('feature2Desc')}</p>
            </div>
          </AnimateOnView>

          <AnimateOnView stagger={4} className="group relative text-center p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200/80 hover:border-amber-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-4 tracking-tight">{t('feature3Title')}</h3>
              <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">{t('feature3Desc')}</p>
            </div>
          </AnimateOnView>
        </div>
      </div>
    </section>
  );
}
