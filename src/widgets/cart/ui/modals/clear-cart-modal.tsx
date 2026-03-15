'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';

interface ClearCartModalProps {
  isShow: boolean;
  onClose: () => void;
  colorTheme?: string;
}

export const ClearCartModal: React.FC<ClearCartModalProps> = ({
  isShow,
  onClose,
  colorTheme = '#854C9D',
}) => {
  const clearCart = useShopStore((state) => state.clearCart);

  const handleConfirm = () => {
    vibrateClick();
    clearCart();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity duration-300 ${
          isShow
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          vibrateClick();
          onClose();
        }}
      />

      {/* Modal */}
      <div
        className={`fixed left-1/2 top-1/2 z-101 w-[calc(100vw-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center transition-all duration-300 ${
          isShow
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className='w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4'>
          <Trash2 size={32} />
        </div>

        <h3 className='text-xl font-bold text-gray-900 mb-2'>
          Очистить корзину?
        </h3>
        <p className='text-sm text-gray-500 mb-6'>
          Все добавленные товары будут удалены. Вы уверены?
        </p>

        <div className='flex gap-3 w-full'>
          <button
            onClick={() => {
              vibrateClick();
              onClose();
            }}
            className='flex-1 py-3.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className='flex-1 py-3.5 rounded-xl font-medium text-white transition-opacity hover:opacity-90'
            style={{ backgroundColor: colorTheme }}
          >
            Очистить
          </button>
        </div>
      </div>
    </>
  );
};
