'use client';

import React, { useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';
import { shopApi } from '@/shared/api/shop';
import { MobileSearchModal } from '@/features/mobile-search-modal/ui';

interface CategoriesProps {
  venueSlug: string;
  selectedCategoryId: number;
  colorTheme?: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  venueSlug,
  selectedCategoryId,
  colorTheme = '#854C9D',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', venueSlug],
    queryFn: () => shopApi.getCategories(venueSlug),
    enabled: !!venueSlug,
  });

  const selectCategory = (id: number) => {
    vibrateClick();
    const params = new URLSearchParams(searchParams.toString());

    if (id === 0) {
      params.delete('categoryId');
    } else {
      params.set('categoryId', id.toString());
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <section className='sticky top-[80px] md:top-[90px] z-10 bg-[#F1F2F3] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        <div className='flex items-center gap-[15px] pt-[15px] pb-[40px] px-4 md:flex-wrap md:gap-[30px] md:h-[107px] md:overflow-hidden'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-2 min-w-[63px]'
            >
              <div className='w-[56px] h-[56px] rounded-full bg-gray-200 animate-pulse' />
              <div className='w-10 h-2 mt-1 rounded bg-gray-200 animate-pulse' />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    // 1. Секция получила sticky, фон, z-index и скрытие скроллбара
    <section className='sticky top-0 z-10 bg-gray-50 overflow-x-auto overflow-y-hidden md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
      {/* // 2. Внутренний контейнер получил отступы из твоего старого .categories__content */}
      <div
        ref={scrollRef}
        className='flex items-center gap-[15px] pt-[15px] pb-[40px] md:flex-wrap md:gap-[30px] md:h-[107px] md:overflow-hidden'
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Кнопка "Поиск" (для мобилок) */}
        <div className='md:hidden snap-start shrink-0'>
          <CategoryItem
            id={-1}
            title='Поиск'
            isActive={false}
            colorTheme={colorTheme}
            onClick={() => setIsSearchOpen(true)}
            icon={<Search className='w-6 h-6' />}
          />
        </div>

        {/* Кнопка "Все" */}
        <div className='snap-start shrink-0'>
          <CategoryItem
            id={0}
            title='Все блюда'
            isActive={selectedCategoryId === 0}
            colorTheme={colorTheme}
            onClick={() => selectCategory(0)}
            icon={<span className='text-xl font-bold'>🍽️</span>}
          />
        </div>

        {/* Список категорий с сервера */}
        {categories?.map((item) => (
          <div key={item.id} className='snap-start shrink-0'>
            <CategoryItem
              id={item.id}
              title={item.categoryName}
              imageUrl={item.categoryPhoto}
              isActive={selectedCategoryId === item.id}
              colorTheme={colorTheme}
              onClick={() => selectCategory(item.id)}
            />
          </div>
        ))}
      </div>

      <MobileSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        venueSlug={venueSlug}
        colorTheme={colorTheme}
      />
    </section>
  );
};

interface CategoryItemProps {
  id: number;
  title: string;
  isActive: boolean;
  colorTheme: string;
  onClick: () => void;
  imageUrl?: string;
  icon?: React.ReactNode;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  isActive,
  colorTheme,
  onClick,
  imageUrl,
  icon,
}) => {
  const shortTitle = (title || '').trim().split(/\s+/).slice(0, 2).join(' ');

  const handleClick = () => {
    vibrateClick();
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className='text-center cursor-pointer w-15.75 h-15.75'
    >
      <div
        className='w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-solid transition-all duration-200'
        style={{
          backgroundColor: isActive ? colorTheme : 'white',
          borderColor: isActive ? colorTheme : 'white',
          borderWidth: isActive ? '3px' : '1px',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={`w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
          />
        ) : (
          <div className={`${isActive ? 'text-white' : 'text-gray-600'}`}>
            {icon}
          </div>
        )}
      </div>
      <span className='mt-2 font-medium text-[12px] text-center block leading-tight text-black'>
        {shortTitle}
      </span>
    </div>
  );
};
