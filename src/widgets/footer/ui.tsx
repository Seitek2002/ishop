import Link from 'next/link';
import { Phone } from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

export const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-2'>
            <h3
              className='text-2xl font-bold mb-4'
              style={{ color: BRAND.base }}
            >
              Ishop.kg
            </h3>
            <p className='text-gray-300 mb-6 max-w-md'>
              Платформа для создания брендированных интернет-магазинов с
              AI-инструментами и полной автоматизацией.
            </p>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <svg
                  className='h-4 w-4'
                  style={{ color: BRAND.base }}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z'></path>
                  <circle cx='12' cy='10' r='3'></circle>
                </svg>
                <span className='text-gray-300'>г. Бишкек, Кыргызстан</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Phone className='h-4 w-4' style={{ color: BRAND.base }} />
                <a
                  href='tel:+996774500600'
                  className='text-gray-300 hover:opacity-80 transition-colors'
                >
                  +996 774 500 600
                </a>
              </div>
              <div className='flex items-center space-x-2'>
                <svg
                  className='h-4 w-4'
                  style={{ color: BRAND.base }}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M4 4h16v16H4z'></path>
                  <path d='M22 6l-10 7L2 6'></path>
                </svg>
                <a
                  href='mailto:info@ishop.kg'
                  className='text-gray-300 hover:opacity-80 transition-colors'
                >
                  info@ishop.kg
                </a>
              </div>
            </div>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Платформа</h4>
            <ul className='space-y-2 text-gray-300'>
              <li>
                <a
                  href='#features'
                  className='hover:opacity-80 transition-colors'
                >
                  Возможности
                </a>
              </li>
              <li>
                <a href='#' className='hover:opacity-80 transition-colors'>
                  Цены
                </a>
              </li>
              <li>
                <a href='#' className='hover:opacity-80 transition-colors'>
                  Интеграции
                </a>
              </li>
              <li>
                <a href='#' className='hover:opacity-80 transition-colors'>
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Компания</h4>
            <ul className='space-y-2 text-gray-300'>
              <li>
                <a href='#' className='hover:opacity-80 transition-colors'>
                  О нас
                </a>
              </li>
              <li>
                <a href='#' className='hover:opacity-80 transition-colors'>
                  Блог
                </a>
              </li>
              <li>
                <a href='#' className='hover:opacity-80 transition-colors'>
                  Карьера
                </a>
              </li>
              <li>
                <a
                  href='#contact'
                  className='hover:opacity-80 transition-colors'
                >
                  Контакты
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <div className='text-gray-400 text-sm mb-4 md:mb-0'>
            © {new Date().getFullYear()} ishop.kg. Все права защищены.
          </div>
          <div className='flex space-x-6 text-sm text-gray-400'>
            <Link
              href='/privacy'
              className='hover:opacity-80 transition-colors'
            >
              Политика конфиденциальности
            </Link>
            <a href='#' className='hover:opacity-80 transition-colors'>
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
