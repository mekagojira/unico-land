import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['jp', 'vi'],
  defaultLocale: 'jp',
  localePrefix: 'always',
  localeDetection: false // Disable browser language detection
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

