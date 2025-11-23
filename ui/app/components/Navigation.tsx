'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('nav');

  // Close sidebar when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
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
    { key: 'blog', href: '#blog', isLink: false },
    { key: 'contact', href: '/contact', isLink: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://svc.uni-co-jinzai.com/api/image/1710811080191916f93c44cef41299b052827fa8582f1.png"
                  alt="Uni-Co 株式会社"
                  width={180}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                  unoptimized
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                item.isLink ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors relative group tracking-wide"
                  >
                    {t(item.key)}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all group-hover:w-full"></span>
                  </Link>
                ) : (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors relative group tracking-wide"
                  >
                    {t(item.key)}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all group-hover:w-full"></span>
                  </a>
                )
              ))}
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2 z-50 relative">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <button
                className="p-3 rounded-lg text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 transition-all active:bg-blue-100/50 active:scale-95 flex-shrink-0"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <Image
                src="https://svc.uni-co-jinzai.com/api/image/1710811080191916f93c44cef41299b052827fa8582f1.png"
                alt="Uni-Co 株式会社"
                width={140}
                height={50}
                className="h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
            <button
              className="p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1 px-4">
              {navItems.map((item) => (
                item.isLink ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-1">{t(item.key)}</span>
                    <svg
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <a
                    key={item.key}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-1">{t(item.key)}</span>
                    <svg
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            <div className="text-xs text-gray-500 text-center">
              <p>Uni-Co 株式会社</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
