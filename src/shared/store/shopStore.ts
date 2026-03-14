import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShopState {
  phoneNumber: string;
  activeSpot: number;
  deliveryType: 2 | 3; // 2 - Самовывоз, 3 - Доставка
  setPhoneNumber: (phone: string) => void;
  setDeliveryType: (type: 2 | 3) => void;
  setActiveSpot: (spot: number) => void;
  clearCart: () => void; // Пока просто заглушка, позже добавим сюда товары
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      phoneNumber: '',
      activeSpot: 0,
      deliveryType: 3,
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setDeliveryType: (type) => set({ deliveryType: type }),
      setActiveSpot: (spot) => set({ activeSpot: spot }),
      clearCart: () => set({}), // Очистка корзины при смене магазина
    }),
    {
      name: 'ishop-cart-storage',
    },
  ),
);
