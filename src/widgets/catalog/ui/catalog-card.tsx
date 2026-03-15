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
    <div className='cart-block bg-white rounded-[12px] p-[4px] relative flex flex-col justify-between min-h-[216px] shadow-sm border border-gray-100'>
      {/* IMAGE */}
      <div className='cart-img relative overflow-hidden rounded-[12px] aspect-square flex items-center justify-center w-full'>
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

        {/* BUTTON */}
        <div
          className={`absolute bottom-0 right-0 h-[44px] ml-auto flex items-center transition-all duration-500 ease-in-out overflow-hidden cursor-pointer rounded-tl-[12px] opacity-90 ${
            quantity ? 'w-full px-[12px] left-0' : 'w-[25%]'
          }`}
          style={{ backgroundColor: colorTheme }}
        >
          <div className='relative w-full h-full flex items-center justify-center overflow-hidden'>
            {/* MINUS */}
            <button
              onClick={handleRemove}
              className={`absolute left-0 flex items-center justify-center text-white font-bold text-[20px] transition-all duration-300 ${
                quantity
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              -
            </button>

            {/* COUNT */}
            <span
              className={`text-white text-center font-bold text-[14px] select-none transition-all duration-200 ${
                quantity ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              } ${bounce ? 'scale-125' : ''}`}
            >
              {quantity}
            </span>

            {/* PLUS */}
            <button
              onClick={handleAdd}
              className={`absolute right-0 text-white font-bold text-[20px] flex items-center justify-center transition-transform duration-300 ${
                quantity ? 'rotate-360' : 'rotate-0'
              }`}
              style={{ width: quantity ? '25%' : '100%' }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className='flex items-center gap-[4px] mt-[8px] mb-[4px] px-1'>
        {item.modificators?.length ? (
          <span
            className='font-[600] text-[16px]'
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
            className='font-[600] text-[16px]'
            style={{ color: colorTheme }}
          >
            {+item.productPrice} с
          </span>
        )}
      </div>

      {/* NAME */}
      <h4 className='px-1 font-[500] text-[16px] leading-[17px] line-clamp-2 text-gray-900 pb-2'>
        {item.productName}
      </h4>
    </div>
  );
};
