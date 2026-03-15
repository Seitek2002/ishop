'use client';

import { IModificator } from "@/shared/api/types";

export const ProductModifiers = ({
  sizes,
  selectedSize,
  colorTheme,
  onSelect,
}: {
  sizes: IModificator[];
  selectedSize: IModificator | null;
  colorTheme: string;
  onSelect: (s: IModificator) => void;
}) => {
  if (!sizes.length) return null;
  return (
    <div className='mb-2'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='font-semibold text-gray-900'>Размер</h3>
        <span className='text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-500'>
          Обязательно
        </span>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        {sizes.map((sizeKey, index) => {
          const isActive = selectedSize?.name === sizeKey.name;
          return (
            <button
              key={index}
              onClick={() => onSelect(sizeKey)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${isActive ? 'bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
              style={{ borderColor: isActive ? colorTheme : undefined }}
            >
              <span
                className={`block text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}
              >
                {sizeKey.name}
              </span>
              <span
                className='block font-bold mt-1'
                style={{ color: colorTheme }}
              >
                {sizeKey.price} c
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
