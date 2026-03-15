'use client';

import React, { useState } from 'react';
import { OrderProduct } from '@/shared/api/types';

interface OrderItemCardProps {
  item: OrderProduct;
  colorTheme?: string;
}

const defaultProduct = '/assets/images/default-product.svg';

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  colorTheme = '#854C9D',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className='flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors mb-3 last:mb-0'>
      {/* Изображение */}
      <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0'>
        {!isLoaded && (
          <div className='absolute inset-0 bg-gray-200 animate-pulse' />
        )}
        <img
          src={item.product.productPhoto || defaultProduct}
          alt={item.product.productName}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Информация */}
      <div className='flex-1 min-w-0 py-1 flex flex-col justify-between'>
        <div className='flex justify-between items-start gap-2'>
          <h3 className='text-sm font-semibold text-gray-900 truncate leading-tight'>
            {item.product.productName}
          </h3>
        </div>
        <span className='text-xs text-gray-400 mt-0.5'>
          {item.product.weight} г
        </span>

        <div className='flex items-center text-xs mt-1'>
          <span className='font-bold' style={{ color: colorTheme }}>
            {item.price} с
          </span>
          <span className='text-gray-300 mx-1.5'>|</span>
          <span className='text-gray-500 font-medium'>{item.count} шт</span>
        </div>
      </div>
    </div>
  );
};
