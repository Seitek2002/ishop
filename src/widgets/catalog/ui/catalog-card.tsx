'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { IProduct } from '@/shared/api/types';

interface CatalogCardProps {
  item: IProduct;
  colorTheme?: string;
  onFoodDetail?: (item: IProduct) => void;
  onMaxExceeded?: () => void;
}

const defaultProduct = '/assets/images/default-product.svg';

export const CatalogCard: React.FC<CatalogCardProps> = ({
  item,
  colorTheme = '#854C9D',
  onFoodDetail,
  onMaxExceeded,
}) => {
  const { cart, addToCart, decrementQuantity } = useShopStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [bounce, setBounce] = useState(false);

  const srcCandidate = useMemo(
    () => item.productPhotoSmall || defaultProduct,
    [item.productPhotoSmall],
  );

  const baseId = String(item.id);

  const foundCartItem = cart.find((c) => String(c.id).split(',')[0] === baseId);

  const quantity = cart
    .filter((ci) => String(ci.id).split(',')[0] === baseId)
    .reduce((sum, ci) => sum + ci.quantity, 0);

  // подпрыгивание числа
  useEffect(() => {
    if (quantity > 0) {
      // Откладываем начало анимации на 10мс, чтобы выйти из синхронного рендера
      const startTimer = setTimeout(() => setBounce(true), 10);
      const endTimer = setTimeout(() => setBounce(false), 200);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [quantity]);

  const openFoodDetail = () => {
    vibrateClick();
    if (onFoodDetail) onFoodDetail(item);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    vibrateClick();

    if (item.modificators?.length) {
      openFoodDetail();
      return;
    }

    if (item.quantity <= 0 || quantity >= item.quantity) {
      if (onMaxExceeded) onMaxExceeded();
      return;
    }

    addToCart({
      ...item,
      id: baseId,
      availableQuantity: item.quantity,
      modificators: undefined,
      quantity: 1,
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    vibrateClick();

    if (item.modificators?.length) {
      openFoodDetail();
    } else if (foundCartItem) {
      decrementQuantity(foundCartItem.id);
    }
  };

  return (
    <div className='cart-block bg-white rounded-xl p-1 relative flex flex-col justify-between min-h-54 shadow-sm border border-gray-100'>
      {/* IMAGE */}
      <div className='cart-img relative overflow-hidden rounded-xl aspect-square flex items-center justify-center w-full'>
        {!isLoaded && (
          <div className='absolute inset-0 bg-gray-200 animate-pulse z-0' />
        )}

        <img
          src={srcCandidate}
          alt={item.productName || 'product'}
          className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onClick={openFoodDetail}
        />

        {/* BUTTON BACKGROUND & MINUS/COUNT */}
        <div
          className={`absolute bottom-0 right-0 h-11 ml-auto flex items-center transition-all duration-500 ease-in-out overflow-hidden cursor-pointer rounded-tl-xl opacity-90 ${
            quantity ? 'w-full px-3 left-0' : 'w-[25%]'
          }`}
          style={{ backgroundColor: colorTheme }}
        >
          <div className='relative w-full h-full flex items-center justify-center overflow-hidden'>
            {/* MINUS */}
            <button
              onClick={handleRemove}
              className={`absolute left-0 flex items-center justify-center text-white transition-all duration-300 ${
                quantity
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              <MinusIcon className='w-5 h-5' />
            </button>

            {/* COUNT */}
            <span
              className={`text-white text-center font-bold text-[14px] select-none transition-all duration-200 ${
                quantity ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              } ${bounce ? 'scale-125' : ''}`}
            >
              {quantity}
            </span>
          </div>
        </div>

        {/* PLUS */}
        <button
          onClick={handleAdd}
          className={`absolute w-1/4 right-0 bottom-0 text-white h-11 flex items-center justify-center transition-transform duration-300 ${
            quantity ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <PlusIcon className='w-5 h-5' />
        </button>
      </div>

      {/* PRICE */}
      <div className='flex items-center gap-1 mt-2 mb-1 px-1'>
        {item.modificators?.length ? (
          <span
            className='font-semibold text-[16px]'
            style={{ color: colorTheme }}
          >
            от {+item.modificators[0].price} с
          </span>
        ) : item.quantity === 0 ? (
          <span className='text-[14px] font-semibold text-red-500'>
            Нет в наличии
          </span>
        ) : (
          <span
            className='font-semibold text-[16px]'
            style={{ color: colorTheme }}
          >
            {+item.productPrice} с
          </span>
        )}
      </div>

      {/* NAME */}
      <h4 className='px-1 font-medium text-[16px] leading-4.25 line-clamp-2 text-gray-900 pb-2'>
        {item.productName}
      </h4>
    </div>
  );
};

// ============================================================================
// SVG ИКОНКИ
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
