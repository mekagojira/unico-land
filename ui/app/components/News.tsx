import { useTranslations } from 'next-intl';
import AnimateOnView from './AnimateOnView';

export default function News() {
  const t = useTranslations('news');

  const newsItems = [{ key: 'item1' }, { key: 'item2' }];

  return (
    <section id="news" className="py-20 md:py-28 lg:py-40 bg-gradient-to-b from-white via-stone-50/30 to-white relative pattern-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="text-center mb-14 md:mb-20 lg:mb-28">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight px-4">
            {t('title')}
          </h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-4 md:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light px-4">{t('subtitle')}</p>
        </AnimateOnView>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-5 md:space-y-6">
            {newsItems.map((item, index) => (
              <AnimateOnView key={index} stagger={index + 1}>
              <article
                className="group bg-white rounded-2xl border border-gray-200 p-8 md:p-10 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <time className="text-sm font-medium text-gray-500 mb-3 block tracking-wide">
                      {t(`items.${item.key}.date`)}
                    </time>
                    <h3 className="text-xl lg:text-2xl font-light text-gray-900 group-hover:text-amber-700 transition-colors leading-snug">
                      {t(`items.${item.key}.title`)}
                    </h3>
                  </div>
                  <a
                    href="#"
                    className="text-amber-700 hover:text-amber-800 font-medium text-sm inline-flex items-center tracking-wide transition-colors duration-300"
                  >
                    {t('details')}
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
              </AnimateOnView>
            ))}
          </div>

          <AnimateOnView stagger={3} className="text-center mt-14 md:mt-20">
            <a
              href="#"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-amber-600 hover:text-amber-700 transition-all duration-300 tracking-wide"
            >
              {t('viewAll')}
            </a>
          </AnimateOnView>
        </div>
      </div>
    </section>
  );
}
