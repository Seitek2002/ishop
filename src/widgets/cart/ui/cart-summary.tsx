'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Ticket,
  Coins,
  Truck,
  Pencil,
  Receipt,
} from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  deliveryFreeFrom: number | null;
  isDelivery: boolean;

  availablePoints: number;
  maxUsablePoints: number;
  usePoints: boolean;
  setUsePoints: (val: boolean) => void;
  onOpenPointsModal: () => void;

  promoCode: string;
  setPromoCode: (val: string) => void;

  displayTotal: number;
  colorTheme?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee,
  deliveryFreeFrom,
  isDelivery,
//   availablePoints,
  maxUsablePoints,
  usePoints,
  setUsePoints,
  onOpenPointsModal,
  promoCode,
  setPromoCode,
  displayTotal,
  colorTheme = '#854C9D',
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(!!promoCode);

  const amountToFreeDelivery =
    deliveryFreeFrom !== null ? Math.max(0, deliveryFreeFrom - subtotal) : 0;
  const isFreeDeliveryEarned = amountToFreeDelivery === 0;

  return (
    <div className='flex flex-col gap-4 mt-6'>
      {/* 1. Баннер бесплатной доставки */}
      {isDelivery && deliveryFreeFrom !== null && (
        <div
          className='flex items-center gap-3 p-3 rounded-xl bg-opacity-10 border'
          style={{
            backgroundColor: `${colorTheme}15`,
            borderColor: `${colorTheme}30`,
          }}
        >
          <div
            className='p-2 rounded-full bg-white shadow-sm shrink-0'
            style={{ color: colorTheme }}
          >
            <Truck size={20} />
          </div>
          <div className='text-sm font-medium text-gray-800'>
            {isFreeDeliveryEarned ? (
              <span>
                Супер! У вас{' '}
                <span style={{ color: colorTheme, fontWeight: 700 }}>
                  бесплатная доставка
                </span>
              </span>
            ) : (
              <span>
                Добавьте еще на{' '}
                <span style={{ color: colorTheme, fontWeight: 700 }}>
                  {amountToFreeDelivery} с
                </span>{' '}
                для бесплатной доставки
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Основная карточка с итогами */}
      <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4'>
        {/* Промокод */}
        {!showPromoInput ? (
          <button
            type='button'
            onClick={() => {
              vibrateClick();
              setShowPromoInput(true);
            }}
            className='flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity w-max'
            style={{ color: colorTheme }}
          >
            <Ticket size={18} />У меня есть промокод
          </button>
        ) : (
          <div className='flex flex-col gap-1.5 transition-all'>
            <label className='text-sm font-medium text-gray-700 flex justify-between'>
              Промокод
              <span className='text-gray-400 font-normal text-xs'>
                Необязательно
              </span>
            </label>
            <div className='relative'>
              <Ticket
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                size={18}
              />
              <input
                type='text'
                placeholder='Введите промокод...'
                value={promoCode}
                onChange={(e) => {
                  const val = e.target.value;
                  setPromoCode(val);
                  try {
                    localStorage.setItem('promoCode', val);
                  } catch {}
                }}
                className='w-full h-11 bg-gray-50 border border-transparent focus:border-gray-300 rounded-xl pl-10 pr-4 outline-none transition-all text-sm uppercase'
              />
            </div>
          </div>
        )}

        <hr className='border-gray-100' />

        {/* Детали заказа (Аккордеон) */}
        <div className='flex flex-col gap-2'>
          <button
            onClick={() => {
              vibrateClick();
              setIsDetailsOpen(!isDetailsOpen);
            }}
            className='flex items-center justify-between text-gray-500 hover:text-gray-800 transition-colors w-full'
          >
            <span className='flex items-center gap-2 text-sm font-medium'>
              <Receipt size={18} />
              Детали заказа
            </span>
            {isDetailsOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          <div
            className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
              isDetailsOpen
                ? 'max-h-50 mt-2 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Стоимость товаров</span>
              <span>{subtotal} с</span>
            </div>
            {isDelivery && (
              <div className='flex justify-between text-sm text-gray-500'>
                <span>Доставка</span>
                <span
                  className={
                    isFreeDeliveryEarned ? 'text-green-500 font-medium' : ''
                  }
                >
                  {isFreeDeliveryEarned ? 'Бесплатно' : `${deliveryFee} с`}
                </span>
              </div>
            )}
          </div>
        </div>

        <hr className='border-gray-100' />

        {/* Баллы */}
        <div className='flex items-center justify-between gap-4'>
          <label className='flex items-center gap-3 cursor-pointer group'>
            <div className='relative flex items-center justify-center'>
              <input
                type='checkbox'
                checked={usePoints}
                onChange={(e) => {
                  vibrateClick();
                  if (e.target.checked) {
                    onOpenPointsModal();
                  } else {
                    setUsePoints(false);
                  }
                }}
                className='peer sr-only'
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-all ${
                  usePoints
                    ? 'border-transparent'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: usePoints ? colorTheme : 'transparent',
                }}
              >
                {usePoints && (
                  <svg
                    className='w-full h-full text-white p-0.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                )}
              </div>
            </div>
            <span className='text-sm font-medium text-gray-800 select-none'>
              Списать баллы
            </span>
          </label>

          <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold text-gray-600 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg'>
              <Coins size={14} className='text-yellow-500' />
              {maxUsablePoints} б.
            </span>
            {usePoints && (
              <button
                onClick={() => {
                  vibrateClick();
                  onOpenPointsModal();
                }}
                className='p-1.5 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-lg transition-colors'
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        </div>

        <hr className='border-gray-100' />

        {/* Итоговая сумма */}
        <div className='flex items-end justify-between pt-1'>
          <span className='font-semibold text-gray-900'>К оплате</span>
          <span className='text-2xl font-bold tracking-tight text-gray-900 leading-none'>
            {displayTotal} <span className='text-lg text-gray-500'>с</span>
          </span>
        </div>
      </div>
    </div>
  );
};
