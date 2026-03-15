'use client';

import React, { useState } from 'react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { CartItem } from '@/shared/api/types';

interface CartItemCardProps {
  item: CartItem;
  colorTheme?: string;
  onMaxExceeded?: () => void;
}

const defaultProduct = '/assets/images/default-product.svg';

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  colorTheme = '#854C9D',
  onMaxExceeded,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cart = useShopStore((state) => state.cart);
  const incrementQuantity = useShopStore((state) => state.incrementQuantity);
  const decrementQuantity = useShopStore((state) => state.decrementQuantity);

  const increment = () => {
    vibrateClick();

    // Считаем общее количество ЭТОГО товара в корзине (включая все его размеры/модификаторы)
    const baseId = String(item.id).split(',')[0];
    const currentTotal = cart
      .filter((ci) => String(ci.id).split(',')[0] === baseId)
      .reduce((sum, ci) => sum + ci.quantity, 0);

    const maxAvail = item.availableQuantity ?? Number.POSITIVE_INFINITY;

    if (currentTotal >= maxAvail) {
      if (onMaxExceeded) onMaxExceeded();
      return;
    }

    incrementQuantity(item.id);
  };

  const decrement = () => {
    vibrateClick();
    decrementQuantity(item.id);
  };

  const price = item.modificators
    ? item.modificators.price
    : Number(item.productPrice);

  return (
    <div className='flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors'>
      {/* Изображение */}
      <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0'>
        {!isLoaded && (
          <div className='absolute inset-0 bg-gray-200 animate-pulse' />
        )}
        <img
          src={item.productPhotoSmall || item.productPhoto || defaultProduct}
          alt={item.productName}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (e.currentTarget.src !== defaultProduct) {
              e.currentTarget.src = defaultProduct;
              setIsLoaded(true);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Информация */}
      <div className='flex-1 min-w-0 py-1 flex flex-col justify-between'>
        <h3
          className='text-sm font-semibold text-gray-900 truncate'
          title={item.productName}
        >
          {item.productName}
        </h3>
        <div className='flex items-center text-xs mt-1'>
          <span className='font-bold' style={{ color: colorTheme }}>
            {price} с
          </span>
          {item.modificators?.name && (
            <>
              <span className='text-gray-300 mx-1.5'>|</span>
              <span className='text-gray-500 font-medium truncate'>
                {item.modificators.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Счетчик */}
      <div className='flex items-center bg-gray-50 rounded-lg p-1 shrink-0 border border-gray-100'>
        <button
          onClick={decrement}
          className='w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors text-lg font-medium'
        >
          -
        </button>
        <span className='w-6 text-center text-sm font-bold text-gray-900 tabular-nums'>
          {item.quantity}
        </span>
        <button
          onClick={increment}
          className='w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors text-lg font-medium'
        >
          +
        </button>
      </div>
    </div>
  );
};
