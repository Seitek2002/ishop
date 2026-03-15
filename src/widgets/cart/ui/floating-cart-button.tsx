'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';

interface FloatingCartButtonProps {
  colorTheme?: string;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  colorTheme = '#854C9D',
}) => {
  const router = useRouter();
  const params = useParams();
  const cart = useShopStore((state) => state.cart);

  // Защита от гидратации (чтобы Zustand не ругался на сервере)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Оборачиваем в setTimeout, чтобы избежать синхронного каскадного рендера
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { totalItems, totalPrice } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const price = item.modificators?.price || item.productPrice;
        acc.totalItems += item.quantity;
        acc.totalPrice += price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 },
    );
  }, [cart]);

  if (!mounted || totalItems === 0) return null;

  return (
    <div className='fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-80 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300'>
      <button
        onClick={() => {
          vibrateClick();
          router.push(`/${params.locale}/${params.venue}/cart`);
        }}
        className='w-full bg-gray-900 text-white shadow-xl rounded-2xl p-4 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all'
        style={{ backgroundColor: colorTheme }}
      >
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <ShoppingBag size={24} />
            <span
              className='absolute -top-2 -right-2 bg-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full'
              style={{ color: colorTheme }}
            >
              {totalItems}
            </span>
          </div>
          <span className='font-semibold text-lg'>Корзина</span>
        </div>
        <span className='font-bold text-lg'>{totalPrice} с</span>
      </button>
    </div>
  );
};
