import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['ru', 'kg', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  // В next-intl v4+ мы получаем Promise, который нужно дождаться
  const locale = await requestLocale;

  // Проверяем, существует ли локаль
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
