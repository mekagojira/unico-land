'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('nav');

  const navItems = [
    { key: 'home', href: '/', isLink: false },
    { key: 'about', href: '/company', isLink: true },
    { key: 'services', href: '/service', isLink: true }, 
    { key: 'news', href: '#news', isLink: false },
    { key: 'blog', href: '#blog', isLink: false },
    { key: 'contact', href: '/contact', isLink: true },
  ];

  return (
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
          <div className="md:hidden flex items-center space-x-3">
            <LanguageSwitcher />
            <button
              className="p-2 rounded-md text-gray-700 hover:text-blue-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
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
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
            {navItems.map((item) => (
              item.isLink ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.key)}
                </a>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
