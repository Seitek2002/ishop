'use client';

import { useState, FormEvent } from 'react';
import { Phone, Loader2, CheckCircle } from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

export const LeadForm = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Здесь позже подключим реальный API POST /api/lead/
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setPhone('');
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Произошла ошибка. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='text-center py-12'>
        <CheckCircle className='w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-6' />
        <h3 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>
          Спасибо за заявку!
        </h3>
        <p className='text-lg text-gray-600'>
          Мы свяжемся с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-xl mx-auto'>
      <div className='mb-6'>
        <label
          htmlFor='phone'
          className='block text-sm font-semibold text-gray-700 mb-3'
        >
          Телефон *
        </label>
        <div className='relative'>
          <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400' />
          <input
            type='tel'
            id='phone'
            name='phone'
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none transition-colors focus:border-gray-400'
            placeholder='+996 XXX XXX XXX'
          />
        </div>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm'>
          {error}
        </div>
      )}

      <button
        type='submit'
        disabled={loading}
        className='w-full py-4 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
        style={{
          backgroundImage: `linear-gradient(to right, ${BRAND.base}, ${BRAND.baseDark})`,
        }}
      >
        {loading ? (
          <>
            <Loader2 className='w-5 h-5 animate-spin' />
            <span>Отправка...</span>
          </>
        ) : (
          <span>Получить свой интернет-магазин</span>
        )}
      </button>

      <p className='text-center text-sm text-gray-500 mt-4'>
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
};
