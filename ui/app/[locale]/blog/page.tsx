'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { api, type BlogPost, type CompanyInfo } from '@/lib/api';

const BlogListContent = () => {
  const params = useParams();
  const locale = (params?.locale as string) || 'jp';
  const t = useTranslations('blog');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res, company] = await Promise.all([
          api.getBlogPosts({ locale, page, limit: 12 }),
          api.getCompanyInfo().catch(() => null),
        ]);
        setPosts(res.data ?? []);
        setPagination(res.pagination ?? { page: 1, limit: 12, total: 0, pages: 0 });
        setCompanyInfo(company);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locale, page]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="pt-24 md:pt-32 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 tracking-tight">
              {t('title')}
            </h1>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-4" />
            <p className="text-lg md:text-xl text-gray-600 font-light">{t('subtitle')}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-light">
              {t('noPosts')}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                        <div className="aspect-video bg-gradient-to-br from-blue-100/50 to-stone-100/50 flex items-center justify-center">
                          <span className="text-gray-400 text-sm font-light">{t('imagePlaceholder')}</span>
                        </div>
                      )}
                      <div className="p-6 lg:p-8">
                        <span className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full mb-3 tracking-wide">
                          {t('category')}
                        </span>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-600 line-clamp-2 font-light">
                          {post.excerpt || ''}
                        </p>
                        <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-700">
                          {t('readMore')}
                          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ←
                  </button>
                  <span className="px-4 py-2 text-gray-600 font-light">
                    {page} / {pagination.pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer companyInfo={companyInfo} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(BlogListContent), { ssr: false });
