export type ServiceMode = 1 | 2 | 3; // 1 - На месте, 2 - Самовывоз, 3 - Доставка
export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 7;

export interface WorkSchedule {
  dayOfWeek: number;
  dayName: string;
  workStart: string;
  workEnd: string;
  isDayOff: boolean;
  is24h: boolean;
}

export interface Spot {
  id: number;
  name: string;
  address: string | null;
}

export interface Organization {
  companyName: string;
  slug: string;
  colorTheme: string;
  logo: string | null;
  schedules: WorkSchedule[];
  serviceFeePercent: number;
  spots: Spot[];
  isDeliveryAvailable: boolean;
  deliveryFixedFee: string;
  deliveryFreeFrom: string | null;
  isTakeoutAvailable: boolean;
  terms: string | null;
  description: string | null;
}

export interface Category {
  id: number;
  categoryName: string;
  categoryPhoto: string;
  categoryPhotoSmall: string;
}

export interface Product {
  id: number;
  productName: string;
  weight: number;
  productPhoto: string;
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
  // orderProducts также вложены, если нужно, можем типизировать глубже
}
