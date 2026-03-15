import { apiClient } from './client';
import type {
  Organization,
  IProduct,
  ICategory,
  OrderCreate,
  OrderList,
} from './types';

export const shopApi = {
  // Получить данные магазина (используем в Server Component app/[venue]/page.tsx)
  getOrganization: (slug: string, init?: RequestInit) =>
    apiClient<Organization>(`/organizations/${slug}/`, init),

  // Получить товары с фильтрацией по магазину
  getProducts: (
    organizationSlug: string,
    categoryId?: number,
    search?: string,
    spotId?: string,
  ) => {
    // Собираем параметры динамически. Если чего-то нет (undefined), оно не полетит в URL
    const params: Record<string, string | number> = { organizationSlug };

    if (categoryId && categoryId !== 0) params.category = categoryId;
    if (search) params.search = search;
    if (spotId) params.spotId = spotId;

    return apiClient<IProduct[]>('/products/', { params });
  },

  // Получить категории
  getCategories: (organizationSlug: string) =>
    apiClient<ICategory[]>('/categories/', { params: { organizationSlug } }),

  // Создать заказ (используем в мутации TanStack Query)
  createOrder: (data: OrderCreate) =>
    apiClient<OrderCreate>('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Получить статус заказа (используем для Polling на клиенте)
  getOrderStatus: (orderId: number) =>
    apiClient<OrderList>(`/orders/${orderId}/`),

  getOrders: async (params: {
    phone: string;
    organizationSlug: string;
    spotId: number;
  }) => {
    // Временно возвращаем пустой массив или делай реальный fetch
    // const res = await fetch(`.../orders?phone=${params.phone}...`);
    // return res.json();
    return [];
  },
};
