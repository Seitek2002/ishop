'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { CartItemCard } from './ui/cart-item-card';
import {
  getTodayScheduleWindow,
  isOutsideWorkTime,
} from '@/shared/lib/timeUtils';
import { WorkTimeModal } from '@/features/work-time-modal/ui';

interface DesktopCartProps {
  venue: any; // Временно any, позже заменим на тип Organization
  createOrder?: () => void;
  disabled?: boolean;
}

export const DesktopCart: React.FC<DesktopCartProps> = ({
  venue,
  createOrder,
  disabled,
}) => {
  const t = useTranslations('Header'); // Заменишь на нужный неймспейс
  const router = useRouter();
  const pathname = usePathname();

  const cart = useShopStore((state) => state.cart);
  const colorTheme = venue?.colorTheme || '#854C9D';

  const [showWorkTimeModal, setShowWorkTimeModal] = useState(false);
  const [showStockToast, setShowStockToast] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showMaxStockToast = () => {
    vibrateClick();
    setShowStockToast(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowStockToast(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    vibrateClick();

    const { window: todayWindow, isClosed } = getTodayScheduleWindow(
      venue?.schedules,
      venue?.schedule,
    );
    if (isClosed || isOutsideWorkTime(todayWindow)) {
      setShowWorkTimeModal(true);
      return;
    }

    // Если мы уже на странице корзины — вызываем функцию создания заказа, иначе переходим в корзину
    if (pathname.includes('/cart')) {
      if (createOrder) createOrder();
    } else {
      // Переход на страницу корзины с сохранением локали и слага заведения
      router.push(`${pathname}/cart`);
    }
  };

  // Вычисляем итоговую сумму для кнопки
  const subtotal = cart.reduce((acc, item) => {
    const price = item.modificators?.price || item.productPrice;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[calc(100vh-120px)]'>
      {/* Тост лимита остатков */}
      <div
        className={`fixed top-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 transition-all duration-300 ${showStockToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
      >
        Нельзя добавить больше — такого количества товара нет
      </div>

      {/* Модалка рабочего времени */}
      <WorkTimeModal
        isShow={showWorkTimeModal}
        onClose={() => setShowWorkTimeModal(false)}
      />

      {/* Шапка корзины */}
      <div className='p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50'>
        <h2 className='font-bold text-lg text-gray-900'>Корзина</h2>
        {venue?.table?.tableNum && (
          <div className='bg-white px-3 py-1 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100'>
            Стол №{venue.table.tableNum}
          </div>
        )}
      </div>

      {/* Список товаров */}
      <div className='flex-1 overflow-y-auto p-5'>
        {cart.length > 0 ? (
          <div className='flex flex-col gap-4'>
            {cart.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                colorTheme={colorTheme}
                onMaxExceeded={showMaxStockToast}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-40 text-center text-gray-400'>
            <span className='text-4xl mb-3'>🛒</span>
            <p className='font-medium'>В корзине пока пусто</p>
          </div>
        )}
      </div>

      {/* Футер с кнопкой */}
      <div className='p-5 border-t border-gray-100 bg-white shrink-0'>
        <button
          onClick={handleClick}
          disabled={disabled || cart.length === 0}
          className='w-full py-3.5 rounded-xl text-white font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-6'
          style={{ backgroundColor: colorTheme }}
        >
          <span>Далее</span>
          {cart.length > 0 && <span>{subtotal} с</span>}
        </button>
      </div>
    </div>
  );
};
