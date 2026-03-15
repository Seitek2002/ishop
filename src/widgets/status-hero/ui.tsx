'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';

import 'swiper/css';
import 'swiper/css/pagination';

import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import {
  getTodayScheduleWindow,
  isOutsideWorkTime,
} from '@/shared/lib/timeUtils';
import { shopApi } from '@/shared/api/shop';
import { IOrder, Organization } from '@/shared/api/types';

interface StatusHeroProps {
  venue: Organization; // Тип Organization
}

export const StatusHero: React.FC<StatusHeroProps> = ({ venue }) => {
  const router = useRouter();
  const phoneNumber = useShopStore((state) => state.phoneNumber);

  // 1. Состояние для монтирования и времени
  const [isMounted, setIsMounted] = useState(false);
  const [isClosedNow, setIsClosedNow] = useState(false);

  // 2. Храним ТОЛЬКО апдейты от вебсокетов (в виде словаря: { id_заказа: { status, statusText } })
  const [wsUpdates, setWsUpdates] = useState<Record<number, Partial<IOrder>>>(
    {},
  );

  const defaultSpotId =
    venue?.defaultDeliverySpot ?? venue?.spots?.[0]?.id ?? 0;

  // Получаем начальный список заказов
  const { data: fetchedOrders } = useQuery({
    queryKey: ['orders', phoneNumber, venue?.slug],
    queryFn: () =>
      shopApi.getOrders({
        phone: phoneNumber,
        organizationSlug: venue?.slug,
        spotId: defaultSpotId,
      }),
    enabled: !!phoneNumber && !!venue?.slug,
  });

  // WebSockets: обновляем только словарь wsUpdates
  useEffect(() => {
    if (!phoneNumber) return;

    const ws = new WebSocket(
      `wss://ishop.kg/ws/orders/?phone_number=${phoneNumber}`,
    );
    ws.onopen = () => console.log('StatusHero WebSocket connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setWsUpdates((prev) => ({
          ...prev,
          [data.order_id]: {
            status: data.status,
            statusText: data.status_text,
          },
        }));
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    return () => {
      ws.close();
      console.log('StatusHero WebSocket disconnected');
    };
  }, [phoneNumber]);

  // Проверка рабочего времени
  useEffect(() => {
    if (!venue || (!venue.schedules && !venue.schedule)) {
      return;
    }

    const checkTime = () => {
      if (!venue || (!venue.schedules && !venue.schedule)) {
        return;
      }

      const { window, isClosed } = getTodayScheduleWindow(
        venue.schedules,
        venue.schedule,
      );
      setIsClosedNow(isClosed || isOutsideWorkTime(window));
      setIsMounted(true);
    };

    // Оборачиваем первый вызов в setTimeout, чтобы избежать синхронного setState
    // и порадовать строгий React Compiler
    const initTimer = setTimeout(checkTime, 0);
    const interval = setInterval(checkTime, 60000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [venue]);

  const handleOrderClick = (orderId: number) => {
    vibrateClick();
    router.push(`/orders/${orderId}`);
  };

  const getStatusData = (status: number) => {
    if (status === 1) return 'text-green-500';
    if (status === 7) return 'text-red-500';
    return 'text-orange-500';
  };

  if (!isMounted) return null;

  // Скрещиваем данные с сервера и живые апдейты от вебсокетов на лету
  const activeOrders: IOrder[] = (fetchedOrders || []).map((order: IOrder) => {
    if (wsUpdates[order.id]) {
      return { ...order, ...wsUpdates[order.id] } as IOrder;
    }
    return order;
  });

  if (!activeOrders.length && !isClosedNow) {
    return null;
  }

  return (
    <section className='w-full relative rounded-2xl overflow-hidden mb-6'>
      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        className='w-full h-40 md:h-56 bg-white rounded-2xl'
      >
        {isClosedNow && (
          <SwiperSlide>
            <div
              className='w-full h-full bg-cover bg-center flex flex-col justify-center p-6 relative'
              style={{
                backgroundImage: `url('/assets/images/OrderStatus/schedule-status.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className='absolute inset-0' />
              <p className='text-xl md:text-3xl max-w-[70%] font-bold text-gray-600 relative z-10 leading-tight'>
                Сейчас нерабочее время
              </p>
            </div>
          </SwiperSlide>
        )}

        {activeOrders.map((order: IOrder) => {
          const colorClass = getStatusData(order.status);
          const bgImage =
            order.status === 0
              ? '/assets/images/OrderStatus/Offer-1.png'
              : '/assets/images/OrderStatus/Offer-2.png';

          return (
            <SwiperSlide key={`order-${order.id}`}>
              <div
                onClick={() => handleOrderClick(order.id)}
                className='w-full h-full bg-cover bg-center flex flex-col justify-center p-6 relative cursor-pointer'
                style={{ backgroundImage: `url('${bgImage}')` }}
              >
                <div className='absolute inset-0 bg-black/40 transition-opacity hover:bg-black/50' />

                <div className='relative z-10'>
                  <span className='text-white text-sm md:text-base font-medium opacity-80 mb-1 block'>
                    Заказ №{order.id}
                  </span>
                  <p
                    className={`text-xl md:text-3xl max-w-[70%] font-bold ${colorClass} leading-tight drop-shadow-md`}
                  >
                    {order.statusText || 'Ожидайте, заказ обрабатывается.'}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
