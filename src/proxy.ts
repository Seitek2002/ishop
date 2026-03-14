import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
});

// В Next.js 16 обязателен именованный экспорт функции proxy
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
