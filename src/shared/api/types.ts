export type ServiceMode = 1 | 2 | 3; // 1 - На месте, 2 - Самовывоз, 3 - Доставка
export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 7;

// --- РАСПИСАНИЕ И ЗАВЕДЕНИЕ ---
export interface WorkSchedule {
  dayOfWeek: number;
  dayName?: string;
  workStart: string | null;
  workEnd: string | null;
  isDayOff?: boolean;
  is24h?: boolean;
}

export interface Spot {
  id: number;
  name: string;
  address: string | null;
}

export interface Organization {
  id?: number;
  slug: string;
  name?: string;
  colorTheme?: string;
  defaultDeliverySpot?: number;
  spots?: Spot[];
  schedule?: string;
  schedules?: WorkSchedule[];
  table?: { tableNum: string | number };

  companyName: string;
  logo: string | null;
  serviceFeePercent: number;
  isDeliveryAvailable: boolean;
  deliveryFixedFee: string;
  deliveryFreeFrom: string | null;
  isTakeoutAvailable: boolean;
  terms: string | null;
  description: string | null;
}

// --- ТОВАРЫ И КАТЕГОРИИ ---
export interface ICategory {
  id: number;
  categoryName: string;
  categoryPhoto: string;
  categoryPhotoSmall: string;
}

export interface IModificator {
  id: number;
  name: string;
  price: number;
}

export interface IProduct {
  id: number | string;
  productName: string;
  productDescription?: string;
  productPrice: number;
  quantity: number;
  productPhoto?: string;
  productPhotoSmall?: string;
  productPhotoLarge?: string;
  isRecommended?: boolean;
  weight?: number;

  category?: ICategory;
  categories?: {
    categoryName: string;
    id: number;
  }[];
  modificators?: IModificator[];
}

// --- КОРЗИНА (Zustand) ---
export interface CartItem extends Omit<IProduct, 'id' | 'modificators'> {
  id: string; // В корзине ID строго строка (напр. "123" или "123,45")
  quantity: number; // Сколько выбрал юзер
  availableQuantity: number; // Сколько максимум доступно на складе
  modificators?: IModificator; // В корзине лежит только один ВЫБРАННЫЙ модификатор (или undefined)
}

// --- ЗАКАЗЫ ---
export interface IOrder {
  id: number;
  status: number;
  statusText: string;
  serviceMode: number;
}

export interface OrderProductCreate {
  product: number;
  count: number;
  modificator?: number | null;
}

export interface OrderCreate {
  phone: string;
  comment?: string | null;
  serviceMode: ServiceMode;
  address?: string | null;
  servicePrice?: string;
  tipsPrice?: number;
  spot?: number | null;
  orderProducts: OrderProductCreate[];
  useBonus?: boolean;
  promoCode?: string | null;
}

export interface OrderList {
  id: number;
  totalPrice: string;
  status: OrderStatus;
  createdAt: string;
  serviceMode: ServiceMode;
  address: string | null;
  comment: string | null;
  phone: string;
  statusText: string;
  orderProducts: OrderProduct[];
}

export interface OrderProduct {
  product: IProduct;
  count: number;
  price: string | number;
  modificator?: number | null;
}
