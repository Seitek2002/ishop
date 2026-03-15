'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { shopApi } from '@/shared/api/shop';
import { Organization } from '@/shared/api/types';
import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { OrderItemCard } from '@/widgets/order/ui/order-item-card';

interface OrderStatusClientProps {
  venue: Organization;
}

// Твои статусы из старого кода, переведенные на иконки Lucide
const STATUS_MESSAGES: Record<
  number,
  Record<
    number,
    { text: string; icon: React.ReactNode; bg: string; color: string }
  >
> = {
  1: {
    // На месте
    0: {
      text: 'Принят',
      icon: <Clock />,
      bg: 'bg-blue-50',
      color: 'text-blue-500',
    },
    1: {
      text: 'Ожидает',
      icon: <CheckCircle2 />,
      bg: 'bg-amber-50',
      color: 'text-amber-500',
    },
    7: {
      text: 'Отменен',
      icon: <XCircle />,
      bg: 'bg-red-50',
      color: 'text-red-500',
    },
  },
  2: {
    // На вынос
    0: {
      text: 'В обработке',
      icon: <Clock />,
      bg: 'bg-blue-50',
      color: 'text-blue-500',
    },
    1: {
      text: 'Ожидает выдачи',
      icon: <UtensilsCrossed />,
      bg: 'bg-green-50',
      color: 'text-green-500',
    },
    7: {
      text: 'Отменен',
      icon: <XCircle />,
      bg: 'bg-red-50',
      color: 'text-red-500',
    },
  },
  3: {
    // Доставка
    0: {
      text: 'В обработке',
      icon: <Clock />,
      bg: 'bg-blue-50',
      color: 'text-blue-500',
    },
    1: {
      text: 'Доставляется',
      icon: <Truck />,
      bg: 'bg-indigo-50',
      color: 'text-indigo-500',
    },
    7: {
      text: 'Отменен',
      icon: <XCircle />,
      bg: 'bg-red-50',
      color: 'text-red-500',
    },
  },
};

export const OrderStatusClient: React.FC<OrderStatusClientProps> = ({
  venue,
}) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const orderId = params.id;

  // Достаем телефон из Zustand, чтобы открыть WebSocket
  const { phoneNumber } = useShopStore();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // 1. Первичный запрос (или запасной Polling, если WS упадет)
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => shopApi.getOrderStatus(Number(orderId)),
    enabled: !!orderId,
    refetchInterval: (q) => {
      // Если статус 7 (отменен) или WebSocket работает идеально, можно отключить
      if (q.state.data?.status === 7) return false;
      return 10000; // Резервный пуллинг раз в 10 сек
    },
  });

  // 2. Магия WebSocket!
  useEffect(() => {
    if (!orderId || !phoneNumber) return;

    // Подключаемся к твоему старому URL
    const ws = new WebSocket(
      `wss://ishop.kg/ws/orders/?phone_number=${phoneNumber}&site=imenu`,
    );

    ws.onopen = () => console.log('✅ WebSocket подключен');

    ws.onmessage = (event) => {
      try {
        const wsData: { order_id: number; status: number } = JSON.parse(
          event.data,
        );

        // Если прилетел статус именно нашего заказа
        if (wsData.order_id === Number(orderId)) {
          // Мгновенно обновляем кэш TanStack Query!
          queryClient.setQueryData(['order', orderId], (oldData: any) => {
            if (!oldData) return oldData;
            return { ...oldData, status: wsData.status };
          });
        }
      } catch (e) {
        console.error('Ошибка парсинга WS:', e);
      }
    };

    ws.onerror = (error) => console.error('❌ Ошибка WebSocket:', error);
    ws.onclose = () => console.log('🔌 WebSocket отключен');

    return () => ws.close(); // Очистка при уходе со страницы
  }, [orderId, phoneNumber, queryClient]);

  if (!orderId) return null;

  if (isLoading || !order) {
    return (
      <div className='min-h-screen bg-[#F1F2F3] flex flex-col items-center justify-center'>
        <div className='w-10 h-10 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-4' />
      </div>
    );
  }

  // Расчет сумм (как в твоем старом solveTotalSum)
  const subtotal = order.orderProducts.reduce(
    (acc, item) => acc + Number(item.price) * item.count,
    0,
  );
  const serviceFee = subtotal * ((venue.serviceFeePercent || 0) / 100);
  const cartSum = subtotal + serviceFee;

  // Достаем иконку и текст статуса
  const currentStatusConfig = STATUS_MESSAGES[order.serviceMode]?.[
    order.status
  ] || {
    text: 'Обработка...',
    icon: <Clock />,
    bg: 'bg-gray-50',
    color: 'text-gray-500',
  };

  return (
    <div className='min-h-screen bg-[#F1F2F3] pb-28 md:pb-12 pt-4 md:pt-8 font-inter'>
      <div className='max-w-[1140px] mx-auto px-4'>
        {/* Шапка */}
        <div className='flex items-center gap-3 mb-6'>
          <button
            onClick={() => {
              vibrateClick();
              router.push(`/${venue.slug}`);
            }}
            className='p-2 bg-white rounded-full shadow-sm text-gray-700 hover:text-gray-900 transition-colors'
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className='text-2xl font-bold text-gray-900'>
            Заказ #{order.id}
          </h1>
        </div>

        <div className='md:flex md:flex-row-reverse items-start gap-6'>
          {/* Правая колонка на десктопе (Статус и QR) */}
          <div className='md:w-[40%] flex flex-col gap-6 mb-6 md:mb-0'>
            {/* Блок статуса */}
            <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center'>
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${currentStatusConfig.bg} ${currentStatusConfig.color}`}
              >
                {React.cloneElement(
                  currentStatusConfig.icon as React.ReactElement,
                  { size: 40 },
                )}
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {order.statusText || currentStatusConfig.text}
              </h2>

              <div className='mt-4 p-4 bg-gray-50 rounded-2xl w-full flex flex-col items-center'>
                <span className='text-sm text-gray-500 mb-3'>
                  Покажите QR-код на кассе
                </span>
                <div className='p-3 bg-white rounded-xl shadow-sm'>
                  <QRCode value={`ISHOP.KG/ORDERS/${order.id}`} size={140} />
                </div>
              </div>
            </div>

            {/* Инфа о заказе */}
            <div className='bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 text-sm'>
              <div className='flex justify-between border-b border-gray-100 pb-3'>
                <span className='text-gray-500'>Телефон</span>
                <span className='font-semibold text-gray-900'>
                  {order.phone}
                </span>
              </div>

              {order.address && (
                <div className='flex justify-between border-b border-gray-100 pb-3'>
                  <span className='text-gray-500'>Адрес доставки</span>
                  <span className='font-medium text-gray-900 text-right max-w-[60%]'>
                    {order.address}
                  </span>
                </div>
              )}

              <div className='flex justify-between'>
                <span className='text-gray-500'>Тип заказа</span>
                <span
                  className='font-semibold text-gray-900'
                  style={{ color: venue.colorTheme }}
                >
                  {order.serviceMode === 1 &&
                    `На месте (Стол ${venue.table?.tableNum || '-'})`}
                  {order.serviceMode === 2 && 'Самовывоз'}
                  {order.serviceMode === 3 && 'Доставка'}
                </span>
              </div>
            </div>
          </div>

          {/* Левая колонка (Товары и Чек) */}
          <div className='md:w-[60%] flex flex-col gap-6'>
            {/* Чек (Аккордеон как в корзине) */}
            <div className='bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3'>
              <button
                onClick={() => {
                  vibrateClick();
                  setIsDetailsOpen(!isDetailsOpen);
                }}
                className='flex items-center justify-between text-gray-500 hover:text-gray-800 transition-colors w-full'
              >
                <span className='text-sm font-medium'>Детали чека</span>
                {isDetailsOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              <div
                className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${isDetailsOpen ? 'max-h-[100px] mt-1 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Стоимость товаров</span>
                  <span>{subtotal} с</span>
                </div>
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Обслуживание ({venue.serviceFeePercent || 0}%)</span>
                  <span>{serviceFee} с</span>
                </div>
              </div>

              <hr className='border-gray-100' />
              <div className='flex justify-between items-end pt-1'>
                <span className='font-semibold text-gray-900'>Итого</span>
                <span className='text-2xl font-bold text-gray-900 leading-none'>
                  {cartSum} <span className='text-lg text-gray-500'>с</span>
                </span>
              </div>
            </div>

            {/* Список товаров */}
            <div className='bg-white rounded-2xl p-4 shadow-sm'>
              <h4 className='font-bold text-gray-900 mb-4'>
                Заказы ({order.orderProducts.length})
              </h4>
              <div className='flex flex-col'>
                {order.orderProducts.map((op, idx) => (
                  <OrderItemCard
                    key={idx}
                    item={op}
                    colorTheme={venue.colorTheme}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная кнопка на главную */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40'>
        <button
          onClick={() => {
            vibrateClick();
            router.push(`/${venue.slug}`);
          }}
          className='w-full h-14 rounded-xl text-white font-bold text-lg flex items-center justify-center transition-opacity hover:opacity-90'
          style={{ backgroundColor: venue.colorTheme || '#854C9D' }}
        >
          На главную
        </button>
      </div>
    </div>
  );
};
