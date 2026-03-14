import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'ru',
  // Убираем префикс /ru для дефолтного языка, чтобы URL был чище
  localePrefix: 'as-needed',
});

export const config = {
  // Применяем middleware ко всем путям, кроме системных
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
