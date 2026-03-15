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
  name?: string;
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
}

// --- ТОВАРЫ И КАТЕГОРИИ ---
export interface ICategory {
  id: number;
  categoryName: string;
  categoryPhoto?: string;
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
  categories?: ICategory[];
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
