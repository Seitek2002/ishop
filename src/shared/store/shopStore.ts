import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../api/types';

interface ShopState {
  cart: CartItem[];
  // Добавляем поля для оформления заказа
  phoneNumber: string;
  address: string;
  comment: string;
  activeSpot: number | null; // ID выбранного заведения для самовывоза
  orderType: 2 | 3; // 2 - Самовывоз, 3 - Доставка

  addToCart: (item: CartItem) => void;
  incrementQuantity: (id: string) => void; // <-- ДОБАВИЛИ В ИНТЕРФЕЙС
  decrementQuantity: (id: string) => void;
  clearCart: () => void;

  setPhoneNumber: (phone: string) => void;
  setAddress: (address: string) => void;
  setComment: (comment: string) => void;
  setActiveSpot: (spotId: number) => void;
  setOrderType: (type: 2 | 3) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      phoneNumber: '',
      address: '',
      comment: '',
      activeSpot: null,
      orderType: 3,

      addToCart: (item) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex((c) => c.id === item.id);

        if (existingItemIndex >= 0) {
          const newCart = [...cart];
          newCart[existingItemIndex].quantity += item.quantity;
          set({ cart: newCart });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      // <-- ДОБАВИЛИ ЛОГИКУ ПРИБАВЛЕНИЯ
      incrementQuantity: (id) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex((c) => c.id === id);

        if (existingItemIndex >= 0) {
          const newCart = [...cart];
          newCart[existingItemIndex].quantity += 1;
          set({ cart: newCart });
        }
      },

      decrementQuantity: (id) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex((c) => c.id === id);

        if (existingItemIndex >= 0) {
          const newCart = [...cart];
          if (newCart[existingItemIndex].quantity > 1) {
            newCart[existingItemIndex].quantity -= 1;
            set({ cart: newCart });
          } else {
            set({ cart: cart.filter((c) => c.id !== id) });
          }
        }
      },

      clearCart: () => set({ cart: [] }),

      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setAddress: (address) => set({ address }),
      setComment: (comment) => set({ comment }),
      setActiveSpot: (activeSpot) => set({ activeSpot }),
      setOrderType: (orderType) => set({ orderType }),
    }),
    {
      name: 'ishop-cart-storage', // Имя в localStorage
    },
  ),
);
