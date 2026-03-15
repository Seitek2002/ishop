'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, X } from 'lucide-react';

import { vibrateClick } from '@/shared/lib/haptics';
import { shopApi } from '@/shared/api/shop';
import { CatalogCard } from '@/widgets/catalog/ui/catalog-card';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueSlug: string;
  colorTheme?: string;
}

const notFoundImg = '/assets/images/not-found-products.png';

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
  venueSlug,
  colorTheme = '#854C9D',
}) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Паттерн React 18+: Сброс состояния при открытии модалки БЕЗ useEffect
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSearchText('');
      setDebouncedSearch('');
    }
  }

  // Дебаунс: ждем 500мс после того, как юзер перестал печатать, чтобы не спамить API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText.trim()), 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Блокировка скролла (здесь оставляем только работу с DOM)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const { data: items, isLoading } = useQuery({
    queryKey: ['products-search', venueSlug, debouncedSearch],
    queryFn: () => shopApi.getProducts(venueSlug, undefined, debouncedSearch),
    // Запрашиваем только если модалка открыта и есть текст поиска
    enabled: isOpen && debouncedSearch.length > 0,
  });

  // Та самая сортировка из твоего старого кода
  const sortedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => {
      const sa = Number.isFinite(a.quantity) && a.quantity > 0 ? 1 : 0;
      const sb = Number.isFinite(b.quantity) && b.quantity > 0 ? 1 : 0;
      if (sb !== sa) return sb - sa;

      const ha =
        a.productPhoto || a.productPhotoSmall || a.productPhotoLarge ? 1 : 0;
      const hb =
        b.productPhoto || b.productPhotoSmall || b.productPhotoLarge ? 1 : 0;
      if (hb !== ha) return hb - ha;

      const an = (a.productName || '').localeCompare(b.productName || '');
      if (an !== 0) return an;
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  }, [items]);

  const handleClose = () => {
    vibrateClick();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[120] bg-[#F1F2F3] flex flex-col transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      {/* Шапка поиска */}
      <div className='bg-white px-4 py-3 flex items-center gap-3 shadow-sm shrink-0'>
        <button onClick={handleClose} className='p-2 -ml-2 text-gray-600'>
          <ArrowLeft size={24} />
        </button>

        <div className='flex-1 flex items-center bg-gray-100 rounded-xl px-3 h-11 border border-transparent focus-within:border-gray-300 transition-colors'>
          <Search size={20} className='text-gray-400 shrink-0' />
          <input
            type='text'
            autoFocus={isOpen}
            placeholder='Поиск блюд...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='w-full h-full bg-transparent outline-none px-2 text-gray-900 text-base placeholder:text-gray-400'
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className='p-1 rounded-full bg-gray-300 text-white hover:bg-gray-400'
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Результаты поиска */}
      <div className='flex-1 overflow-y-auto p-4'>
        {!debouncedSearch ? (
          <div className='h-full flex flex-col items-center justify-center text-gray-400'>
            <Search size={48} className='mb-4 opacity-20' />
            <p>Введите название блюда</p>
          </div>
        ) : isLoading ? (
          <div className='grid grid-cols-2 gap-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-white rounded-[12px] p-3'>
                <div className='w-full aspect-square bg-gray-200 animate-pulse rounded-xl mb-2' />
                <div className='h-4 bg-gray-200 animate-pulse rounded w-1/3 mb-2' />
                <div className='h-4 bg-gray-200 animate-pulse rounded w-3/4' />
              </div>
            ))}
          </div>
        ) : sortedItems.length > 0 ? (
          <div className='grid grid-cols-2 gap-3 pb-24'>
            {sortedItems.map((item) => (
              <CatalogCard key={item.id} item={item} colorTheme={colorTheme} />
            ))}
          </div>
        ) : (
          <div className='mt-10 flex flex-col items-center text-center'>
            <h3 className='text-2xl font-semibold mb-6 text-gray-800'>
              Увы, ничего не найдено(
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={notFoundImg}
              alt='Not found'
              className='w-[80%] max-w-[300px] opacity-90'
            />
          </div>
        )}
      </div>
    </div>
  );
};
