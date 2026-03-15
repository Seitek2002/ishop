'use client';

import React, { useState } from 'react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { CartItem as ICartItem } from '@/shared/api/types';

interface CartItemProps {
  item: ICartItem;
  colorTheme?: string;
  onMaxExceeded?: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  colorTheme = '#854C9D',
  onMaxExceeded,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { cart, addToCart, decrementQuantity } = useShopStore();

  const handleIncrement = () => {
    vibrateClick();
    // Ищем товар с таким же базовым ID (до запятой) во всей корзине, чтобы проверить общий сток
    const baseId = String(item.id).split(',')[0];
    const currentTotal = cart
      .filter((ci) => String(ci.id).split(',')[0] === baseId)
      .reduce((sum, ci) => sum + ci.quantity, 0);

    const maxAvail = item.availableQuantity ?? Number.POSITIVE_INFINITY;

    if (currentTotal >= maxAvail) {
      if (onMaxExceeded) onMaxExceeded();
      return;
    }

    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = () => {
    vibrateClick();
    decrementQuantity(item.id);
  };

  return (
    <div className='flex items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0'>
      {/* Картинка */}
      <div className='w-17 h-17 shrink-0 relative rounded-xl overflow-hidden bg-gray-50'>
        {!isLoaded && (
          <div className='absolute inset-0 bg-gray-200 animate-pulse' />
        )}
        <img
          src={item.productPhoto || '/assets/images/default-product.svg'}
          alt={item.productName}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Текст (Название и Цена) */}
      <div className='flex-1 min-w-0 flex flex-col justify-center'>
        <h3 className='font-medium text-[14px] leading-tight text-gray-900 mb-1 line-clamp-2'>
          {item.productName}
        </h3>
        <div className='flex items-center text-[13px] flex-wrap gap-1'>
          <span className='font-semibold' style={{ color: colorTheme }}>
            {item.modificators ? item.modificators.price : +item.productPrice} с
          </span>
          {item.modificators?.name && (
            <>
              <span className='text-gray-400'>|</span>
              <span className='text-gray-500 font-medium'>
                {item.modificators.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Счетчик */}
      <div className='flex items-center gap-3 bg-[#F1F2F3] rounded-full px-2 py-1.5 shrink-0'>
        <button
          onClick={handleDecrement}
          className='p-1 text-gray-700 hover:text-gray-900 transition-colors'
        >
          <MinusIcon className='w-4 h-4' />
        </button>

        <span className='font-bold text-[13px] min-w-3.5 text-center select-none text-gray-900'>
          {item.quantity}
        </span>

        <button
          onClick={handleIncrement}
          className='p-1 text-gray-700 hover:text-gray-900 transition-colors'
        >
          <PlusIcon className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SVG ИКОНКИ ДЛЯ СЧЕТЧИКА
// ============================================================================

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 5V19M5 12H19'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M5 12H19'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
