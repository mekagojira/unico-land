'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { api, type BlogPost, type CompanyInfo } from '@/lib/api';

const BlogPostContent = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = (params?.locale as string) || 'jp';
  const t = useTranslations('blog');

  const [post, setPost] = useState<BlogPost | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [postData, company] = await Promise.all([
          api.getBlogPost(slug, locale),
          api.getCompanyInfo().catch(() => null),
        ]);
        setPost(postData);
        setCompanyInfo(company);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
        <Footer companyInfo={null} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">Not Found</h1>
          <p className="text-gray-600 font-light mb-8">The post you are looking for does not exist.</p>
          <Link href="/blog" className="text-blue-700 font-medium hover:text-blue-800">
            {t('backToBlog')}
          </Link>
        </div>
        <Footer companyInfo={companyInfo} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <article className="pt-24 md:pt-32 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 font-light mb-8">
            ← {t('backToBlog')}
          </Link>

          {post.featuredImage && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <header className="mb-10">
            <span className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full mb-4 tracking-wide">
              {t('category')}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-light">
              {post.publishedAt && (
                <span>
                  {t('publishedAt')}: {new Date(post.publishedAt).toLocaleDateString(locale === 'jp' ? 'ja-JP' : 'vi-VN')}
                </span>
              )}
              {post.author?.email && <span>{post.author.email}</span>}
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none font-light text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </article>
      <Footer companyInfo={companyInfo} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(BlogPostContent), { ssr: false });
