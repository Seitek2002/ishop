'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Coins, Calendar, Search, ChevronDown } from 'lucide-react';
import { useShopStore } from '@/shared/store/shopStore';

import { WeeklyScheduleModal } from '@/features/schedule-modal/ui';
import { PhoneBonusModal } from '@/features/phone-bonus-modal/ui';

interface StoreHeaderProps {
  venue: any; // Позже заменим на строгий тип Organization из твоего API
  searchText?: string;
  setSearchText?: (text: string) => void;
}

const LANGUAGES = ['ru', 'kg', 'en'];
const LANGUAGE_MAP: Record<string, string> = {
  ru: 'RU',
  kg: 'KG',
  en: 'ENG',
};

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  venue,
  searchText,
  setSearchText,
}) => {
  const t = useTranslations('Header'); // Подтянем ключи перевода позже
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); // Получаем текущую локаль из URL (например, { locale: 'ru', venue: 'test' })

  const currentLocale = (params.locale as string) || 'ru';
  const activeLang = LANGUAGE_MAP[currentLocale] || 'RU';

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const { phoneNumber, setPhoneNumber } = useShopStore();

  // Здесь позже подключим TanStack Query для получения баллов
  // const { data: bonusData } = useQuery(...)
  const bonusBalance = 0;

  const toggleLanguageMenu = () => {
    setIsLanguageOpen((prev) => !prev);
  };

  const selectLanguage = (newLocale: string) => {
    setIsLanguageOpen(false);
    // Заменяем текущую локаль в URL на новую (например, /ru/shop -> /kg/shop)
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <header className='bg-white rounded-2xl p-3 shadow-sm'>
      {/* Верхняя часть (бывший SupHeader) */}
      <div className='flex items-center justify-between mb-3 gap-2'>
        <div className='flex items-center gap-2'>
          <img
            src='/assets/icons/header-logo.svg'
            width={30}
            alt='iShop Logo'
          />
          <span className='font-bold text-gray-900 hidden sm:inline-block'>
            ishop.kg
          </span>
        </div>

        {setSearchText && (
          <label
            htmlFor='search'
            className='flex-1 max-w-md flex items-center bg-[#F9F9F9] rounded-xl px-3 py-2'
          >
            <Search className='w-5 h-5 text-gray-400 mr-2' />
            <input
              type='text'
              placeholder='Поиск...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              id='search'
              className='bg-transparent border-none outline-none w-full text-sm'
            />
          </label>
        )}

        <div className='flex items-center gap-3'>
          <button
            className='flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors'
            title='Баллы'
            onClick={() => setPhoneModalOpen(true)}
          >
            <Coins size={20} className='text-yellow-500' />
            <span className='text-sm font-bold'>
              {bonusBalance} <span className='hidden md:inline'>б.</span>
            </span>
          </button>

          <div className='relative'>
            <button
              className={`flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isLanguageOpen ? 'bg-gray-200' : ''
              }`}
              onClick={toggleLanguageMenu}
            >
              {activeLang} <ChevronDown size={14} />
            </button>

            {isLanguageOpen && (
              <div className='absolute right-0 top-full mt-1 bg-white shadow-lg rounded-xl py-1 border border-gray-100 z-50 overflow-hidden'>
                {LANGUAGES.filter((lang) => lang !== currentLocale).map(
                  (lang) => (
                    <button
                      key={lang}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                      onClick={() => selectLanguage(lang)}
                    >
                      {LANGUAGE_MAP[lang]}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className='border-gray-100 my-2' />

      {/* Нижняя часть (бывший SubHeader) */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {venue?.logo && (
            <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-100 shrink-0'>
              <img
                src={venue.logo}
                alt={venue.companyName}
                className='w-full h-full object-cover'
              />
            </div>
          )}
          <div
            className='font-bold text-gray-900 truncate max-w-37.5 sm:max-w-xs'
            title={venue?.companyName}
          >
            {venue?.companyName || 'Загрузка...'}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <button
            className='p-2 hover:bg-gray-50 rounded-full transition-colors'
            aria-label='График работы'
            onClick={() => setIsScheduleOpen(true)}
          >
            <Calendar size={20} className='text-gray-600' />
          </button>
          {venue?.table?.tableNum && (
            <div className='bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium text-gray-700'>
              Стол №{venue.table.tableNum}
            </div>
          )}
        </div>
      </div>

      {/* Здесь будут рендериться модалки */}
      <PhoneBonusModal
        isOpen={isPhoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        defaultPhone={phoneNumber || '+996'}
        colorTheme={venue?.colorTheme}
        onSubmit={async (p) => {
          const digits = p.replace(/\D/g, '');
          setPhoneNumber(digits);
          // Здесь TanStack Query сам дернет API бонусов, как только изменится phoneNumber
        }}
      />

      <WeeklyScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        schedules={venue?.schedules}
        fallbackSchedule={venue?.schedule}
        colorTheme={venue?.colorTheme}
      />
    </header>
  );
};
