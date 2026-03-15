'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vibrateClick } from '@/shared/lib/haptics';
import { shopApi } from '@/shared/api/shop';
import { CatalogCard } from './ui/catalog-card';
import { FoodDetailModal } from '@/features/food-detail-modal/ui';
import { IProduct } from '@/shared/api/types';

interface CatalogProps {
  venueSlug: string;
  categoryId: number;
  searchQuery?: string;
  colorTheme?: string;
}

export const Catalog: React.FC<CatalogProps> = ({
  venueSlug,
  categoryId,
  searchQuery = '',
  colorTheme = '#854C9D',
}) => {
  const [selectedFood, setSelectedFood] = useState<IProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStockToast, setShowStockToast] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['products', venueSlug, categoryId, searchQuery],
    queryFn: () => shopApi.getProducts(venueSlug, categoryId, searchQuery),
    enabled: !!venueSlug,
  });

  const showMaxStockToast = () => {
    vibrateClick();
    setShowStockToast(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowStockToast(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Фильтрация товаров по категории
  const filteredItems = useMemo(() => {
    if (!items) return [];

    const base =
      categoryId === 0
        ? items
        : items.filter((p: IProduct) => {
            const fromArray = (p.categories || []).map((c) => c.id);
            const fromSingle = p.category ? [p.category.id] : [];
            const allIds = fromArray.length ? fromArray : fromSingle;
            return allIds.includes(categoryId);
          });

    const hasPhoto = (p: IProduct) => {
      return Boolean(
        p.productPhoto || p.productPhotoSmall || p.productPhotoLarge,
      );
    };

    return [...base].sort((a, b) => {
      const sa = Number.isFinite(a.quantity) && a.quantity > 0 ? 1 : 0;
      const sb = Number.isFinite(b.quantity) && b.quantity > 0 ? 1 : 0;
      if (sb !== sa) return sb - sa;

      const ha = hasPhoto(a) ? 1 : 0;
      const hb = hasPhoto(b) ? 1 : 0;
      if (hb !== ha) return hb - ha;

      const an = (a.productName || '').localeCompare(b.productName || '');
      if (an !== 0) return an;

      return ((a.id as number) || 0) - ((b.id as number) || 0);
    });
  }, [items, categoryId]);

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl p-3 h-64 border border-gray-100 flex flex-col'
          >
            <div className='w-full aspect-square bg-gray-200 animate-pulse rounded-xl mb-3' />
            <div className='h-4 bg-gray-200 animate-pulse rounded w-1/3 mb-2' />
            <div className='h-4 bg-gray-200 animate-pulse rounded w-3/4' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className='relative mt-6'>
      {/* Тост лимита остатков */}
      <div
        className={`fixed top-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 transition-all duration-300 ${showStockToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
      >
        Нельзя добавить больше — такого количества товара нет
      </div>

      {filteredItems.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'>
          {filteredItems.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              colorTheme={colorTheme}
              onMaxExceeded={showMaxStockToast}
              onFoodDetail={(food: IProduct) => {
                setSelectedFood(food);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <span className='text-6xl mb-4'>🍽️</span>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            Увы, ничего не найдено
          </h3>
          <p className='text-gray-500'>Попробуйте выбрать другую категорию</p>
        </div>
      )}

      <FoodDetailModal
        item={selectedFood}
        isShow={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        colorTheme={colorTheme}
      />
    </section>
  );
};
