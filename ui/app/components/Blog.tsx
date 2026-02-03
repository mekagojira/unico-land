'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { api, type BlogPost } from '@/lib/api';
import AnimateOnView from './AnimateOnView';

export default function Blog() {
  const t = useTranslations('blog');
  const locale = useLocale() as string;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBlogPosts({ locale, limit: 4 })
      .then((res) => setPosts(res.data ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <section id="blog" className="py-12 md:py-20 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnView className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight px-4">
            {t('title')}
          </h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-4 md:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light px-4">{t('subtitle')}</p>
        </AnimateOnView>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6 lg:p-8 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-light">
            {t('noPosts')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {posts.map((post, index) => (
              <AnimateOnView key={post.id} stagger={index + 1}>
              <article
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-amber-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Link href={`/blog/${post.slug}`}>
                  {post.featuredImage ? (
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featuredImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100/50 to-stone-100/50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-400 text-sm font-light">{t('imagePlaceholder')}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 lg:p-8">
                    <span className="inline-block px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full mb-4 tracking-wide">
                      {t('category')}
                    </span>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-6 font-light leading-relaxed">
                      {post.excerpt || ''}
                    </p>
                    <span className="text-sm font-medium text-amber-700 hover:text-amber-800 inline-flex items-center tracking-wide">
                      {t('readMore')}
                      <svg
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
              </AnimateOnView>
            ))}
          </div>
        )}

        <AnimateOnView stagger={0} className="text-center mt-16">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide"
          >
            {t('viewAll')}
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
