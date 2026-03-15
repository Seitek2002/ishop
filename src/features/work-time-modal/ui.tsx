'use client';

import React, { useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';

interface WorkTimeModalProps {
  isShow: boolean;
  onClose: () => void;
  colorTheme?: string;
}

export const WorkTimeModal: React.FC<WorkTimeModalProps> = ({
  isShow,
  onClose,
  colorTheme = '#854C9D',
}) => {
  useEffect(() => {
    if (isShow) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isShow]);

  if (!isShow) return null;

  return (
    <>
      <div
        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity animate-in fade-in'
        onClick={() => {
          vibrateClick();
          onClose();
        }}
      />
      <div className='fixed left-1/2 top-1/2 z-101 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200'>
        <button
          onClick={() => {
            vibrateClick();
            onClose();
          }}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X size={20} />
        </button>

        <div className='w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 mt-2'>
          <Clock size={32} style={{ color: colorTheme }} />
        </div>

        <h3 className='text-xl font-bold text-gray-900 mb-2'>
          Заведение закрыто
        </h3>
        <p className='text-gray-500 mb-6 text-sm'>
          К сожалению, сейчас мы не принимаем заказы. Пожалуйста, проверьте наш
          график работы.
        </p>

        <button
          onClick={() => {
            vibrateClick();
            onClose();
          }}
          className='w-full py-3 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90'
          style={{ backgroundColor: colorTheme }}
        >
          Понятно
        </button>
      </div>
    </>
  );
};
