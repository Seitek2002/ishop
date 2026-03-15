'use client';

import React, { useMemo, useState } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';

interface ServerErrorModalProps {
  isShow: boolean;
  onClose: () => void;
  error: any; // В данном случае any оправдан, так как с бэка может прилететь что угодно
  title?: string;
  colorTheme?: string;
}

export const ServerErrorModal: React.FC<ServerErrorModalProps> = ({
  isShow,
  onClose,
  error,
  title = 'Ошибка сервера',
  colorTheme = '#854C9D',
}) => {
  const [copied, setCopied] = useState(false);

  const errorText = useMemo(() => {
    if (!error) return 'Неизвестная ошибка';
    if (typeof error === 'string') return error;
    if (error instanceof Error)
      return `${error.name}: ${error.message}\n${error.stack || ''}`;

    // Безопасный парсинг JSON без зацикливаний
    try {
      const cache = new Set();
      return JSON.stringify(
        error,
        (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) return '[Circular]';
            cache.add(value);
          }
          return value;
        },
        2,
      );
    } catch {
      return String(error);
    }
  }, [error]);

  const handleCopy = async () => {
    try {
      vibrateClick();
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
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

      <div
        className={`fixed left-1/2 top-1/2 z-101 w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl flex flex-col transition-all duration-300 ${
          isShow
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className='flex items-center gap-3 mb-4 text-red-500'>
          <AlertCircle size={24} />
          <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
        </div>

        <p className='text-sm text-gray-500 mb-4'>
          Произошла ошибка при выполнении запроса. Вы можете скопировать лог
          ниже и отправить его в поддержку.
        </p>

        <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 max-h-75 overflow-auto text-xs font-mono text-gray-700 whitespace-pre-wrap wrap-break-word'>
          {errorText}
        </div>

        <div className='flex gap-3'>
          <button
            onClick={handleCopy}
            className='flex-1 py-3.5 rounded-xl font-medium border-2 transition-colors flex items-center justify-center gap-2'
            style={{ borderColor: colorTheme, color: colorTheme }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Скопировано' : 'Скопировать лог'}
          </button>
          <button
            onClick={() => {
              vibrateClick();
              onClose();
            }}
            className='flex-1 py-3.5 rounded-xl font-medium text-white transition-opacity hover:opacity-90'
            style={{ backgroundColor: colorTheme }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  );
};
