'use client';

import React, { useState } from 'react';
import { useMask } from '@react-input/mask';
import { MapPin, Phone, MessageSquare } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { Spot } from '@/shared/api/types';

interface CheckoutFormProps {
  spots?: Spot[];
  colorTheme?: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  spots = [],
  colorTheme = '#854C9D',
}) => {
  // Достаем всё из нашего умного Zustand стора
  const {
    phoneNumber,
    setPhoneNumber,
    address,
    setAddress,
    comment,
    setComment,
    activeSpot,
    setActiveSpot,
    orderType,
    setOrderType,
  } = useShopStore();

  const [showComment, setShowComment] = useState(!!comment);
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Маска для телефона (как в твоем старом коде)
  const phoneRef = useMask({
    mask: '+996 (___) __-__-__',
    replacement: { _: /\d/ },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (val.replace(/\D/g, '').length < 12) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    if (orderType === 3 && val.trim().length < 4) {
      setAddressError('Введите корректный адрес');
    } else {
      setAddressError('');
    }
  };

  return (
    <div className='flex flex-col gap-6 mt-4'>
      {/* 1. Переключатель Доставка / Самовывоз */}
      <div className='flex p-1 bg-gray-200/60 rounded-xl'>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            orderType === 3
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            vibrateClick();
            setOrderType(3);
          }}
        >
          Доставка
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            orderType === 2
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            vibrateClick();
            setOrderType(2);
          }}
        >
          Самовывоз
        </button>
      </div>

      {/* 2. Выбор точки (только для самовывоза) */}
      {orderType === 2 && spots.length > 0 && (
        <div className='flex flex-col gap-3'>
          <h4 className='font-semibold text-gray-900'>Выберите филиал</h4>
          <div className='flex flex-col gap-3'>
            {spots.map((spot) => (
              <label
                key={spot.id}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  activeSpot === spot.id
                    ? 'bg-white'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
                style={{
                  borderColor: activeSpot === spot.id ? colorTheme : undefined,
                }}
              >
                {/* Скрытый нативный инпут */}
                <input
                  type='radio'
                  name='spot'
                  className='peer sr-only'
                  checked={activeSpot === spot.id}
                  onChange={() => {
                    vibrateClick();
                    setActiveSpot(spot.id);
                  }}
                />

                {/* Кастомный кружочек радио-кнопки */}
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    activeSpot === spot.id
                      ? 'border-transparent'
                      : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor:
                      activeSpot === spot.id ? colorTheme : 'transparent',
                  }}
                >
                  {activeSpot === spot.id && (
                    <div className='w-2 h-2 bg-white rounded-full' />
                  )}
                </div>

                {/* Текст */}
                <div className='flex flex-col'>
                  <span className='font-medium text-gray-900 text-sm'>
                    {spot.name}
                  </span>
                  <span className='text-gray-500 text-xs mt-0.5 leading-relaxed'>
                    {spot.address || 'Адрес не указан'}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. Форма контактов */}
      <div className='flex flex-col gap-4'>
        <h4 className='font-semibold text-gray-900'>Ваши данные</h4>

        {/* Телефон */}
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-gray-700'>
            Телефон <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <Phone
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              size={18}
            />
            <input
              ref={phoneRef}
              type='tel'
              placeholder='+996 (___) __-__-__'
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`w-full h-12 bg-white border ${
                phoneError
                  ? 'border-red-500 focus:ring-red-100'
                  : 'border-gray-200 focus:border-gray-400'
              } rounded-xl pl-10 pr-4 outline-none transition-all text-sm`}
            />
          </div>
          {phoneError && (
            <span className='text-red-500 text-xs mt-0.5 ml-1'>
              {phoneError}
            </span>
          )}
        </div>

        {/* Адрес (только для доставки) */}
        {orderType === 3 && (
          <div className='flex flex-col gap-1.5 transition-all'>
            <label className='text-sm font-medium text-gray-700'>
              Адрес доставки <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <MapPin
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                size={18}
              />
              <input
                type='text'
                placeholder='Улица, дом, квартира...'
                value={address}
                onChange={handleAddressChange}
                className={`w-full h-12 bg-white border ${
                  addressError
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-gray-400'
                } rounded-xl pl-10 pr-4 outline-none transition-all text-sm`}
              />
            </div>
            {addressError && (
              <span className='text-red-500 text-xs mt-0.5 ml-1'>
                {addressError}
              </span>
            )}
          </div>
        )}

        {/* Комментарий */}
        {!showComment ? (
          <button
            type='button'
            onClick={() => {
              vibrateClick();
              setShowComment(true);
            }}
            className='text-sm font-medium text-left w-max hover:opacity-80 transition-opacity flex items-center gap-1.5 mt-1'
            style={{ color: colorTheme }}
          >
            <MessageSquare size={16} />
            Добавить комментарий к заказу
          </button>
        ) : (
          <div className='flex flex-col gap-1.5 mt-1 transition-all'>
            <label className='text-sm font-medium text-gray-700'>
              Комментарий
            </label>
            <textarea
              placeholder='Код домофона, сдача с 1000 и т.д.'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-gray-400 transition-all text-sm min-h-20 resize-none'
            />
          </div>
        )}
      </div>
    </div>
  );
};
