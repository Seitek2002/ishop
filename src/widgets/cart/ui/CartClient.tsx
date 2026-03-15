'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Trash2, ArrowLeft } from 'lucide-react';

import { vibrateClick } from '@/shared/lib/haptics';
import { useShopStore } from '@/shared/store/shopStore';
import { shopApi } from '@/shared/api/shop';
import { Organization } from '@/shared/api/types';

// Импортируем наши новые виджеты
import { CartItem } from '@/widgets/cart/ui/cart-item';
import { CheckoutForm } from '@/widgets/cart/ui/checkout-form';
import { CartSummary } from '@/widgets/cart/ui/cart-summary';
import { PointsModal } from './modals/points-modal';
import { ClearCartModal } from './modals/clear-cart-modal';
import { ServerErrorModal } from './modals/server-error-modal';

interface CartPageProps {
  venue: Organization;
}

export const CartClient: React.FC<CartPageProps> = ({ venue }) => {
  const router = useRouter();

  // Достаем всё из Zustand
  const {
    cart,
    clearCart,
    phoneNumber,
    address,
    comment,
    activeSpot,
    orderType,
  } = useShopStore();

  // Локальные стейты UI
  const [promoCode, setPromoCode] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // --- МАГИЯ TANSTACK QUERY ---

  // 1. Получаем баллы юзера (запрашиваем, только если есть телефон)
  const { data: bonusData } = useQuery({
    queryKey: ['bonus', phoneNumber, venue.slug],
    // Замени на свой реальный метод API для баллов
    queryFn: () =>
      shopApi.getClientBonus({
        phone: phoneNumber,
        organizationSlug: venue.slug,
      }),
    enabled: phoneNumber.length >= 12 && !!venue.slug,
  });

  // --- МУТАЦИИ ДЛЯ СМС ---
  const { mutate: sendSmsMutation } = useMutation({
    mutationFn: (phone: string) => shopApi.sendSms(phone),
    onError: (err: any) =>
      setServerError(err?.message || 'Ошибка отправки SMS'),
  });

  const { mutate: verifySmsMutation } = useMutation({
    mutationFn: (data: { phone: string; code: string }) =>
      shopApi.verifySms(data.phone, data.code),
    onSuccess: (res: any) => {
      // <-- Добавили :any сюда, чтобы TS отстал от res.hash
      // Если бэк возвращает hash после проверки СМС, сохраняем его
      if (res?.hash || res?.phoneVerificationHash) {
        localStorage.setItem('hash', res.hash || res.phoneVerificationHash);
      }
      setIsPointsModalOpen(false); // Закрываем модалку только при успехе!
    },
    onError: (err: any) => setServerError(err?.message || 'Неверный код'),
  });

  // 2. Мутация отправки заказа
  const { mutate: createOrder, isPending: isCreating } = useMutation({
    mutationFn: (payload: any) => shopApi.createOrder(payload),
    onSuccess: (response) => {
      // Подмешиваем нужные поля прямо на месте, не ломая вывод типов useMutation
      const res = response as typeof response & {
        paymentUrl?: string;
        phoneVerificationHash?: string;
      };

      if (res?.paymentUrl) {
        // Очищаем корзину перед уходом на оплату
        clearCart();
        window.location.href = res.paymentUrl;
      } else if (res?.phoneVerificationHash) {
        // Логика с SMS-хэшом, если нужна
        localStorage.setItem('hash', res.phoneVerificationHash);
      }
    },
    onError: (err: Error) => {
      setServerError(err.message || 'Ошибка оформления заказа');
    },
  });

  // --- МАТЕМАТИКА КОРЗИНЫ ---

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.modificators?.price || item.productPrice;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const isDelivery = orderType === 3;
  const serviceFeeAmt = subtotal * ((venue.serviceFeePercent || 0) / 100);
  const deliveryFreeFrom =
    venue.deliveryFreeFrom != null ? Number(venue.deliveryFreeFrom) : null;
  const deliveryFixedFee = Number(venue.deliveryFixedFee || 0);

  const deliveryFee = isDelivery
    ? deliveryFreeFrom !== null && subtotal >= deliveryFreeFrom
      ? 0
      : deliveryFixedFee
    : 0;

  const total =
    Math.round((subtotal + serviceFeeAmt + deliveryFee) * 100) / 100;

  const availablePoints = Math.max(0, Math.floor(bonusData?.balance ?? 0));
  const maxUsablePoints = Math.min(availablePoints, Math.floor(total));
  const appliedBonus = usePoints ? Math.min(bonusPoints, maxUsablePoints) : 0;

  const displayTotal = Math.max(
    0,
    Math.round((total - appliedBonus) * 100) / 100,
  );

  // --- ОБРАБОТЧИКИ ---

  const handlePay = () => {
    vibrateClick();

    // Базовая валидация
    if (phoneNumber.replace(/\D/g, '').length < 12) {
      alert('Пожалуйста, введите корректный номер телефона'); // Лучше заменить на красивый toast
      return;
    }
    if (isDelivery && address.trim().length < 4) {
      alert('Пожалуйста, укажите адрес доставки');
      return;
    }

    // Собираем payload как в старом проекте
    const orderProducts = cart.map((item) => ({
      product: +item.id.split(',')[0],
      count: +item.quantity,
      modificator: item.modificators?.id || undefined,
    }));

    const payload = {
      phone: phoneNumber.replace(/\D/g, ''),
      orderProducts,
      comment,
      serviceMode: venue.table?.tableNum ? 1 : orderType,
      address: isDelivery ? address : '',
      spot: activeSpot || venue.spots?.[0]?.id,
      organizationSlug: venue.slug,
      useBonus: usePoints ? true : undefined,
      bonus: usePoints ? appliedBonus : undefined,
      code: promoCode.trim() || undefined,
      hash: localStorage.getItem('hash') || undefined,
    };

    createOrder(payload);
  };

  return (
    <div className='min-h-screen bg-[#F1F2F3] pb-28 md:pb-12 pt-4 md:pt-8 font-inter'>
      <div className='max-w-285 mx-auto px-4'>
        {/* Шапка корзины */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => {
                vibrateClick();
                router.back();
              }}
              className='p-2 bg-white rounded-full shadow-sm text-gray-700 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-2xl font-bold text-gray-900'>Корзина</h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => {
                vibrateClick();
                setIsClearModalOpen(true);
              }}
              className='p-2 text-gray-400 hover:text-red-500 transition-colors'
            >
              <Trash2 size={24} />
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm'>
            <span className='text-6xl mb-4'>🛒</span>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>
              Корзина пуста
            </h2>
            <p className='text-gray-500'>
              Добавьте блюда из меню, чтобы сделать заказ
            </p>
            <button
              onClick={() => router.push(`/${venue.slug}`)}
              className='mt-6 px-6 py-3 rounded-xl text-white font-medium'
              style={{ backgroundColor: venue.colorTheme || '#854C9D' }}
            >
              Перейти в меню
            </button>
          </div>
        ) : (
          <div className='md:flex items-start gap-6'>
            {/* Левая колонка: Товары и Форма */}
            <div className='md:w-[60%] flex flex-col gap-6'>
              {/* Список товаров */}
              <div className='bg-white rounded-2xl p-4 shadow-sm'>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    colorTheme={venue.colorTheme}
                  />
                ))}
              </div>

              {/* Форма оформления (наш виджет из Шага 2) */}
              <div className='bg-white rounded-2xl p-4 shadow-sm'>
                <CheckoutForm
                  spots={venue.spots}
                  colorTheme={venue.colorTheme}
                />
              </div>
            </div>

            {/* Правая колонка: Итоги (наш виджет из Шага 3) */}
            <div className='md:w-[40%] md:sticky md:top-24'>
              <CartSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                deliveryFreeFrom={deliveryFreeFrom}
                isDelivery={isDelivery}
                availablePoints={availablePoints}
                maxUsablePoints={maxUsablePoints}
                usePoints={usePoints}
                setUsePoints={setUsePoints}
                onOpenPointsModal={() => setIsPointsModalOpen(true)}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                displayTotal={displayTotal}
                colorTheme={venue.colorTheme}
              />

              {/* Десктопная кнопка оплаты */}
              <button
                onClick={handlePay}
                disabled={isCreating}
                className='hidden md:flex w-full mt-4 py-4 rounded-xl text-white font-bold text-lg items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50'
                style={{ backgroundColor: venue.colorTheme || '#854C9D' }}
              >
                {isCreating ? 'Оформляем...' : 'Оплатить'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Мобильный плавающий футер */}
      {cart.length > 0 && (
        <div className='md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40'>
          <button
            onClick={handlePay}
            disabled={isCreating}
            className='w-full h-14 rounded-xl text-white font-bold text-lg flex items-center justify-center disabled:opacity-50 transition-opacity'
            style={{ backgroundColor: venue.colorTheme || '#854C9D' }}
          >
            {isCreating ? 'Оформляем...' : `Оплатить ${displayTotal} с`}
          </button>
        </div>
      )}

      {/* Вызов модалок */}
      <PointsModal
        isShow={isPointsModalOpen}
        max={maxUsablePoints}
        initial={maxUsablePoints}
        skipOtp={
          typeof window !== 'undefined' ? !!localStorage.getItem('hash') : false
        }
        colorTheme={venue.colorTheme}
        onCancel={() => {
          setIsPointsModalOpen(false);
          setUsePoints(false);
        }}
        onConfirm={(val) => {
          setBonusPoints(val);
          setUsePoints(true);
          // Отправляем СМС на введенный номер!
          sendSmsMutation(phoneNumber.replace(/\D/g, ''));
        }}
        onConfirmOtp={(code) => {
          // Проверяем введенный код
          verifySmsMutation({ phone: phoneNumber.replace(/\D/g, ''), code });
        }}
      />

      <ClearCartModal
        isShow={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        colorTheme={venue.colorTheme}
      />

      <ServerErrorModal
        isShow={!!serverError}
        error={serverError}
        onClose={() => setServerError(null)}
        colorTheme={venue.colorTheme}
      />
    </div>
  );
};
