'use client';

import React, { useEffect, useState } from 'react';
import { Coins, MessageSquareCode } from 'lucide-react';
import { vibrateClick } from '@/shared/lib/haptics';

interface PointsModalProps {
  isShow: boolean;
  max: number;
  initial?: number;
  skipOtp?: boolean;
  onCancel: () => void;
  onConfirm: (value: number) => void;
  onConfirmOtp: (code: string) => void;
  colorTheme?: string;
}

export const PointsModal: React.FC<PointsModalProps> = ({
  isShow,
  max,
  initial = 0,
  skipOtp = false,
  onCancel,
  onConfirm,
  onConfirmOtp,
  colorTheme = '#854C9D',
}) => {
  const [value, setValue] = useState<number>(initial);
  const [step, setStep] = useState<'points' | 'otp'>('points');
  const [otp, setOtp] = useState<string>('');

  useEffect(() => {
    if (isShow) {
      setValue(initial);
      setStep('points');
      setOtp('');
    }
  }, [isShow, initial]);

  const handlePointsOk = () => {
    const v = Number.isFinite(value) ? value : 0;
    const clamped = Math.max(0, Math.min(Math.floor(v), Math.floor(max)));

    onConfirm(clamped); // Передаем родительскому компоненту сколько списываем

    if (skipOtp) {
      onConfirmOtp('');
      return;
    }
    setStep('otp');
  };

  const handleOtpOk = () => {
    onConfirmOtp((otp || '').trim());
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isShow
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          vibrateClick();
          onCancel();
        }}
      />

      <div
        className={`fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl flex flex-col transition-all duration-300 ${
          isShow
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className='flex justify-center mb-4 text-yellow-500'>
          {step === 'points' ? (
            <Coins size={40} />
          ) : (
            <MessageSquareCode size={40} />
          )}
        </div>

        <h3 className='text-xl font-bold text-gray-900 text-center mb-6'>
          {step === 'points' ? 'Списать баллы' : 'Подтверждение'}
        </h3>

        {step === 'points' ? (
          <div className='flex flex-col gap-2 mb-6'>
            <input
              type='number'
              min={0}
              max={Math.floor(max)}
              value={value || ''}
              onChange={(e) => {
                const num = parseInt(e.target.value);
                const v = Number.isFinite(num) ? num : 0;
                setValue(Math.max(0, Math.min(v, Math.floor(max))));
              }}
              className='w-full text-center text-3xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-400 outline-none pb-2 transition-colors'
              placeholder='0'
            />
            <p className='text-sm text-gray-500 text-center'>
              Доступно для списания:{' '}
              <span className='font-semibold text-gray-900'>
                {Math.floor(max)} б.
              </span>
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-2 mb-6'>
            <input
              type='text'
              inputMode='numeric'
              placeholder='Код из SMS'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className='w-full text-center text-3xl tracking-[0.2em] font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-400 outline-none pb-2 transition-colors'
              maxLength={4}
            />
            <p className='text-sm text-gray-500 text-center'>
              На ваш номер отправлен код
            </p>
          </div>
        )}

        <div className='flex gap-3 w-full'>
          <button
            onClick={() => {
              vibrateClick();
              onCancel();
            }}
            className='flex-1 py-3.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            Отмена
          </button>
          <button
            onClick={() => {
              vibrateClick();
              step === 'points' ? handlePointsOk() : handleOtpOk();
            }}
            disabled={step === 'otp' && otp.length < 4}
            className='flex-1 py-3.5 rounded-xl font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
            style={{ backgroundColor: colorTheme }}
          >
            {step === 'points' ? 'Продолжить' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </>
  );
};
