'use client';

import React, { useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
// import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';
import { shopApi } from '@/shared/api/shop';

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
  //   const t = useTranslations('Header');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Запрашиваем категории через TanStack Query
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', venueSlug],
    queryFn: () => shopApi.getCategories(venueSlug), // Замени на свой реальный метод API
    enabled: !!venueSlug,
  });

  // Функция обновления URL при клике на категорию
  const selectCategory = (id: number) => {
    vibrateClick();

    // Создаем новый объект параметров на основе текущих (чтобы не затереть поиск, если он есть)
    const params = new URLSearchParams(searchParams.toString());

    if (id === 0) {
      params.delete('categoryId'); // Если "Все", просто убираем параметр из URL
    } else {
      params.set('categoryId', id.toString());
    }

    // Обновляем URL без перезагрузки страницы и без скролла наверх
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex flex-col items-center gap-2 min-w-20'>
            <div className='w-16 h-16 rounded-2xl bg-gray-200 animate-pulse' />
            <div className='w-12 h-3 rounded bg-gray-200 animate-pulse' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className='relative w-full'>
      <div
        ref={scrollRef}
        className='flex gap-3 sm:gap-4 pb-4 pt-1'
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Кнопка "Поиск" (для мобилок) */}
        <div className='md:hidden snap-start shrink-0'>
          <CategoryItem
            id={-1}
            title='Поиск'
            isActive={false} // Поиск мы позже свяжем с открытием инпута
            colorTheme={colorTheme}
            onClick={() => {
              /* Тут позже добавим фокус на инпут поиска */
            }}
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
