import { useTranslations } from 'next-intl';

export default function ForeignSupport() {
  const t = useTranslations('foreignSupport');

  const features = [
    {
      key: 'contract',
      icon: '📄',
    },
    {
      key: 'guarantor',
      icon: '🛡️',
    },
    {
      key: 'procedures',
      icon: '🏦',
    },
    {
      key: 'lifestyle',
      icon: '🏠',
    },
  ];

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-white via-stone-50/30 to-white relative overflow-hidden">
      {/* Luxury background pattern */}
      <div className="absolute inset-0 opacity-[0.01]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-59-19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23000000' fill-opacity='1'/%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-6">
            <span className="text-xs font-medium text-blue-700 tracking-[0.2em] uppercase">{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-gray-900 mb-6 md:mb-8 tracking-tighter leading-[1.05] px-4">
            {t('title')}
          </h1>
          <div className="w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed px-4">
            {t('subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-blue-50/50 via-white to-stone-50/30 rounded-3xl border border-blue-100/50 p-8 md:p-12 mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light text-center">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="group relative overflow-hidden rounded-2xl bg-white border border-blue-100/50 hover:border-blue-200/80 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl p-8"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-3 tracking-tight">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Message */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-stone-50/50 rounded-3xl border border-blue-100/50 p-8 md:p-12 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white font-medium rounded-lg hover:from-blue-900 hover:via-blue-800 hover:to-blue-700 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl hover:shadow-blue-900/30 tracking-wide"
          >
            {t('ctaContact')}
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

