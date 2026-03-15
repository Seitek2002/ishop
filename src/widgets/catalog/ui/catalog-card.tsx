'use client';

import React, { useMemo, useState } from 'react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { IProduct } from '@/shared/api/types';

interface CatalogCardProps {
  item: IProduct; // Заменишь на IProduct
  colorTheme?: string;
  onFoodDetail?: (item: IProduct) => void;
  onMaxExceeded?: () => void;
}

const defaultProduct = '/assets/images/default-product.svg'; // Убедись, что картинка лежит в public

export const CatalogCard: React.FC<CatalogCardProps> = ({
  item,
  colorTheme = '#854C9D',
  onFoodDetail,
  onMaxExceeded,
}) => {
  const { cart, addToCart, decrementQuantity } = useShopStore();

  const srcCandidate = useMemo(
    () => item.productPhotoSmall || defaultProduct,
    [item.productPhotoSmall],
  );
  const [isLoaded, setIsLoaded] = useState(srcCandidate === defaultProduct);

  // Ищем товар в корзине
  const baseId = String(item.id);
  const foundCartItem = cart.find((c) => String(c.id).split(',')[0] === baseId);

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

    const currentTotal = cart
      .filter((ci) => String(ci.id).split(',')[0] === baseId)
      .reduce((sum, ci) => sum + ci.quantity, 0);

    if (item.quantity <= 0 || currentTotal >= item.quantity) {
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
    <div className='bg-white rounded-2xl p-3 shadow-sm flex flex-col h-full border border-gray-100 overflow-hidden relative'>
      <div className='relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50'>
        {!isLoaded && (
          <div className='absolute inset-0 bg-gray-200 animate-pulse' />
        )}
        <img
          src={srcCandidate}
          alt={item.productName || 'product'}
          className={`w-full h-full object-cover transition-opacity duration-300 cursor-pointer ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (e.currentTarget.src !== defaultProduct) {
              e.currentTarget.src = defaultProduct;
              setIsLoaded(true);
            }
          }}
          onClick={openFoodDetail}
        />

        {/* Кнопка добавления поверх картинки (как в твоем старом коде) */}
        <div
          className='absolute bottom-2 right-2 flex items-center justify-between rounded-full overflow-hidden transition-all duration-300 shadow-md'
          style={{
            backgroundColor: colorTheme,
            width: foundCartItem?.quantity ? '90px' : '36px',
            height: '36px',
          }}
        >
          {foundCartItem?.quantity ? (
            <>
              <button
                onClick={handleRemove}
                className='w-7.5 h-full flex items-center justify-center text-white text-lg font-medium'
              >
                -
              </button>
              <span className='text-white font-bold text-sm select-none'>
                {foundCartItem.quantity}
              </span>
              <button
                onClick={handleAdd}
                className='w-7.5 h-full flex items-center justify-center text-white text-lg font-medium'
              >
                +
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className='w-full h-full flex items-center justify-center text-white text-xl font-medium'
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-col flex-1'>
        {item.modificators?.length ? (
          <span
            className='font-bold text-sm mb-1'
            style={{ color: colorTheme }}
          >
            от {+item.modificators[0].price} с
          </span>
        ) : item.quantity === 0 ? (
          <span className='font-bold text-sm mb-1 text-red-500'>
            Нет в наличии
          </span>
        ) : (
          <span
            className='font-bold text-sm mb-1'
            style={{ color: colorTheme }}
          >
            {+item.productPrice} с
          </span>
        )}
        <h4 className='text-sm font-medium text-gray-900 leading-snug line-clamp-2'>
          {item.productName}
        </h4>
      </div>
    </div>
  );
};
