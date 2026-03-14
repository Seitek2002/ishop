'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, Phone, Loader2 } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';

interface PhoneBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => Promise<void> | void;
  defaultPhone?: string;
  colorTheme?: string;
}

const normalizePhoneDigits = (v: string): string =>
  (v || '').replace(/\D/g, '');

export const PhoneBonusModal: React.FC<PhoneBonusModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultPhone = '+996',
  colorTheme = '#854C9D',
}) => {
  const [phone, setPhone] = useState<string>(defaultPhone);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPhone(defaultPhone);
      setError('');
      setLoading(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, defaultPhone]);

  const isValid = useMemo(() => {
    const digits = normalizePhoneDigits(phone);
    return digits.length >= 12; // 996 + 9 цифр
  }, [phone]);

  const handleSubmit = async () => {
    vibrateClick();
    if (!isValid) {
      setError('Номер должен содержать минимум 12 цифр');
      return;
    }
    setError('');
    try {
      setLoading(true);
      await onSubmit(phone.trim());
      onClose();
    } catch {
      setError('Не удалось сохранить номер. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-100 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          vibrateClick();
          onClose();
        }}
        aria-hidden
      />

      <div
        className={`fixed left-1/2 top-1/2 z-101 w-[92%] max-w-130 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role='dialog'
      >
        <div className='p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between'>
          <h3 className='text-lg sm:text-xl font-semibold text-gray-900'>
            Баллы
          </h3>
          <button
            aria-label='Закрыть'
            className='p-2 rounded-full hover:bg-gray-100 transition-colors'
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        <div className='p-5 sm:p-6'>
          <p className='text-gray-700 mb-4'>
            Для использования баллов нам нужен ваш номер телефона
          </p>
          <label
            htmlFor='bonus-phone'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Номер телефона (КР)
          </label>
          <div className='relative'>
            <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              id='bonus-phone'
              type='tel'
              inputMode='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+996 XXX XXX XXX'
              className='w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-base'
            />
          </div>
          {error && <div className='mt-2 text-sm text-red-600'>{error}</div>}
        </div>

        <div className='p-5 sm:p-6 pt-0 flex items-center justify-end gap-3'>
          <button
            type='button'
            className='px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors'
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            Отменить
          </button>
          <button
            type='button'
            disabled={loading}
            onClick={handleSubmit}
            className='px-6 py-2.5 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            style={{ backgroundColor: colorTheme }}
          >
            {loading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' /> Сохранение
              </span>
            ) : (
              'Добавить'
            )}
          </button>
        </div>
      </div>
    </>
  );
};
