import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { CompanyInfo } from '@/lib/api';

interface CompanyProps {
  companyInfo?: CompanyInfo | null;
}

export default function Company({ companyInfo }: CompanyProps) {
  const t = useTranslations('company');

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-white via-stone-50/20 to-white relative overflow-hidden">
      {/* Luxury background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-59-19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23000000' fill-opacity='1'/%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Greeting & Introduction Section */}
        <div className="text-center mb-24">
          <div className="inline-block mb-6">
            <span className="text-xs font-medium text-blue-700 tracking-[0.2em] uppercase">{t('badge')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-gray-900 mb-8 tracking-tighter leading-[1.05]">
            {t('title')}
          </h1>
          <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-12"></div>
        </div>

        {/* Greeting Message */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-stone-50/50 rounded-3xl border border-blue-100/50 p-12 md:p-16 mb-16 shadow-xl backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <svg className="w-16 h-16 mx-auto text-blue-600/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight text-gray-900 mb-8 tracking-tight leading-relaxed">
              {companyInfo?.greeting || t('greeting')}
            </h2>
            <div className="prose prose-lg max-w-none">
              {companyInfo?.description && (
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-6">
                  {companyInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-2xl p-10 md:p-14 mb-16">
          <div className="space-y-10">
            {/* Company Name */}
            <div className="text-center pb-10 border-b border-gray-200">
              {companyInfo?.logoUrl && (
                <div className="mb-6 flex justify-center">
                  <Image
                    src={companyInfo.logoUrl}
                    alt={companyInfo.name || t('companyName')}
                    width={200}
                    height={67}
                    className="h-16 w-auto object-contain"
                    unoptimized
                  />
                </div>
              )}
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-3 tracking-tight">
                {companyInfo?.name || t('companyName')}
              </h2>
              <p className="text-xl text-gray-500 font-light tracking-wide">
                {companyInfo?.nameEn || t('companyNameEn')}
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('addressLabel')}
                </h3>
                <p className="text-lg text-gray-900 leading-relaxed font-light">
                  {companyInfo?.address || t('address')}
                  {companyInfo?.address2 && (
                    <>
                      <br />
                      {companyInfo.address2}
                    </>
                  )}
                  {!companyInfo?.address2 && t('address2') && (
                    <>
                      <br />
                      {t('address2')}
                    </>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('establishedLabel')}
                </h3>
                <p className="text-lg text-gray-900 font-light">
                  {companyInfo?.established || t('established')}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('representativeLabel')}
                </h3>
                <p className="text-lg text-gray-900 font-light">
                  {companyInfo?.representative || t('representative')}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('licenseLabel')}
                </h3>
                <p className="text-base text-gray-900 leading-relaxed font-light">
                  {companyInfo?.license || t('license')}
                </p>
              </div>
            </div>

            {/* Organization */}
            {(companyInfo?.organization || t('organization')) && (
              <div className="pt-10 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('organizationLabel')}
                </h3>
                <p className="text-lg text-gray-900 font-light">
                  {companyInfo?.organization || t('organization')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Business Activities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extralight text-gray-900 mb-6 tracking-tight">
              {t('activitiesTitle')}
            </h2>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { key: 'activity1', icon: '🏛️' },
              { key: 'activity2', icon: '📊' },
              { key: 'activity3', icon: '🌍' },
              { key: 'activity4', icon: '🏢' },
            ].map((activity) => (
              <div
                key={activity.key}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl hover:border-blue-200/50 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {activity.icon}
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
                  {t(`activities.${activity.key}.title`)}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light text-lg">
                  {t(`activities.${activity.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-tight">
                {t('contactTitle')}
              </h2>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('phoneLabel')}
                </h3>
                <a 
                  href={`tel:${companyInfo?.phone || t('phone')}`} 
                  className="text-3xl font-light hover:text-blue-400 transition-colors"
                >
                  {companyInfo?.phone || t('phone')}
                </a>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('emailLabel')}
                </h3>
                <a
                  href={`mailto:${companyInfo?.email || t('email')}`}
                  className="text-3xl font-light text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {companyInfo?.email || t('email')}
                </a>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('hoursLabel')}
                </h3>
                <p className="text-2xl font-light">{companyInfo?.hours || t('hours')}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('closedLabel')}
                </h3>
                <p className="text-2xl font-light">{companyInfo?.closed || t('closed')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
