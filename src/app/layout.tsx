import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import './globals.css';

// Подключаем стандартный Inter через Google Fonts
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

// Подключаем локальный Benzin с разным весом
const benzin = localFont({
  src: [
    {
      path: '../../public/assets/fonts/Benzin-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Benzin-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Benzin-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Benzin-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Benzin-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-benzin',
  display: 'swap',
});

// Настраиваем Title, Description и Favicon
export const metadata: Metadata = {
  title: 'iShop',
  description: 'iShop — онлайн-меню и заказы',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body className={`${inter.variable} ${benzin.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
