'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isHomePage = pathname === '' || pathname === '/' || pathname === undefined;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHeroVisible(isHomePage && y < window.innerHeight * 0.82);
    };
    onScroll(); // set initial state
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { key: 'home', href: '/', isLink: false },
    { key: 'about', href: '/company', isLink: true },
    { key: 'services', href: '/service', isLink: true },
    { key: 'news', href: '#news', isLink: false },
    { key: 'blog', href: '/blog', isLink: true },
    { key: 'contact', href: '/contact', isLink: true },
  ];

  const isOverHero = heroVisible && isHomePage;
  const linkClass =
    `text-sm font-medium transition-colors duration-300 relative group tracking-wide py-1 ${
      isOverHero ? 'text-white/95 hover:text-amber-200' : 'text-gray-700 hover:text-amber-700'
    }`;
  const underlineClass =
    'absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 group-hover:w-full';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOverHero
            ? 'bg-transparent border-b border-white/0 shadow-none'
            : scrolled
              ? 'bg-white/98 backdrop-blur-md border-b border-gray-200/60 shadow-sm'
              : 'bg-white/95 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-24 flex items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="https://svc.uni-co-jinzai.com/api/image/1710811080191916f93c44cef41299b052827fa8582f1.png"
              alt="Uni-Co 株式会社"
              className={`h-11 w-auto object-contain transition-all duration-300 ${isOverHero ? 'grayscale brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : ''}`}
            />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) =>
              item.isLink ? (
                <Link key={item.key} href={item.href} className={linkClass}>
                  {t(item.key)}
                  <span className={underlineClass} aria-hidden />
                </Link>
              ) : (
                <a key={item.key} href={item.href} className={linkClass}>
                  {t(item.key)}
                  <span className={underlineClass} aria-hidden />
                </a>
              )
            )}
            <LanguageSwitcher variant={isOverHero ? 'overHero' : 'default'} />
          </div>

          <div className="md:hidden flex items-center gap-2 z-50">
            <div className="hidden sm:block">
              <LanguageSwitcher variant={isOverHero ? 'overHero' : 'default'} />
            </div>
            <button
              type="button"
              className={`p-3 rounded-xl transition-all duration-300 active:scale-95 ${
                isOverHero ? 'text-white/95 hover:text-amber-200 hover:bg-white/10' : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50/50'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <svg className="h-7 w-7" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <img
                src="https://svc.uni-co-jinzai.com/api/image/1710811080191916f93c44cef41299b052827fa8582f1.png"
                alt="Uni-Co"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              className="p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1 px-4">
              {navItems.map((item) =>
                item.isLink ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center px-4 py-3.5 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50/50 rounded-xl transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-1">{t(item.key)}</span>
                    <svg className="w-5 h-5 text-amber-600/60 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <a
                    key={item.key}
                    href={item.href}
                    className="flex items-center px-4 py-3.5 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50/50 rounded-xl transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-1">{t(item.key)}</span>
                    <svg className="w-5 h-5 text-amber-600/60 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )
              )}
            </div>
            <div className="pt-6 pl-4">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
