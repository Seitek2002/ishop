import { apiClient } from './client';
import type {
  Organization,
  Product,
  Category,
  OrderCreate,
  OrderList,
} from './types';

export const shopApi = {
  // Получить данные магазина (используем в Server Component app/[venue]/page.tsx)
  getOrganization: (slug: string, init?: RequestInit) =>
    apiClient<Organization>(`/organizations/${slug}/`, init),

  // Получить товары с фильтрацией по магазину
  getProducts: (organizationSlug: string, spotId?: string) =>
    apiClient<Product[]>('/products/', {
      params: { organizationSlug, ...(spotId && { spotId }) },
    }),

  // Получить категории
  getCategories: (organizationSlug: string) =>
    apiClient<Category[]>('/categories/', { params: { organizationSlug } }),

  // Создать заказ (используем в мутации TanStack Query)
  createOrder: (data: OrderCreate) =>
    apiClient<OrderCreate>('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Получить статус заказа (используем для Polling на клиенте)
  getOrderStatus: (orderId: number) =>
    apiClient<OrderList>(`/orders/${orderId}/`),
};
