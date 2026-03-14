import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const benzin = localFont({
  src: [
    {
      path: '../../../public/assets/fonts/Benzin-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Benzin-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Benzin-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Benzin-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/assets/fonts/Benzin-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-benzin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'iShop',
  description: 'iShop — онлайн-меню и заказы',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${benzin.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
