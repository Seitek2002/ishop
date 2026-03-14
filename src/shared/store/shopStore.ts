import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Позже вынесешь эти интерфейсы в отдельный файл типов
export interface CartItem {
  id: string; // У тебя в старом коде id приводился к строке
  productName: string;
  productPrice: number;
  quantity: number;
  availableQuantity: number;
  productPhotoSmall?: string;
  // ... остальные нужные поля
  [key: string]: any;
}

interface ShopState {
  phoneNumber: string;
  activeSpot: number;
  deliveryType: 2 | 3;
  cart: CartItem[];
  setPhoneNumber: (phone: string) => void;
  setDeliveryType: (type: 2 | 3) => void;
  setActiveSpot: (spot: number) => void;
  clearCart: () => void;

  // Методы корзины
  addToCart: (item: CartItem) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      phoneNumber: '',
      activeSpot: 0,
      deliveryType: 3,
      cart: [],

      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setDeliveryType: (type) => set({ deliveryType: type }),
      setActiveSpot: (spot) => set({ activeSpot: spot }),
      clearCart: () => set({ cart: [] }),

      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find((c) => c.id === item.id);
        if (existing) {
          if (existing.quantity < existing.availableQuantity) {
            set({
              cart: cart.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
              ),
            });
          }
        } else {
          set({ cart: [...cart, { ...item, quantity: 1 }] });
        }
      },

      incrementQuantity: (id) => {
        const { cart } = get();
        set({
          cart: cart.map((c) =>
            c.id === id && c.quantity < c.availableQuantity
              ? { ...c, quantity: c.quantity + 1 }
              : c,
          ),
        });
      },

      decrementQuantity: (id) => {
        const { cart } = get();
        const existing = cart.find((c) => c.id === id);
        if (existing?.quantity === 1) {
          set({ cart: cart.filter((c) => c.id !== id) }); // Удаляем, если было 1
        } else {
          set({
            cart: cart.map((c) =>
              c.id === id ? { ...c, quantity: c.quantity - 1 } : c,
            ),
          });
        }
      },
    }),
    {
      name: 'ishop-cart-storage',
    },
  ),
);
