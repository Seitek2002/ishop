import { apiClient } from './client';
import type {
  Organization,
  IProduct,
  ICategory,
  OrderCreate,
  OrderList,
} from './types';

export const shopApi = {
  // Получить данные магазина
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
      // <-- Возвращаем оригинальный тип OrderCreate, в нем уже есть нужные поля
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Получить статус заказа (используем для Polling на клиенте)
  getOrderStatus: (orderId: number) =>
    apiClient<OrderList>(`/orders/${orderId}/`),

  // Получить баланс клиента
  getClientBonus: (params: { phone: string; organizationSlug: string }) =>
    apiClient<{ balance: number }>('/client/bonus/', { params }),

  // Отправить СМС с кодом
  sendSms: (phoneNumber: string) => {
    const body = new URLSearchParams();
    body.append('phoneNumber', phoneNumber);

    return apiClient<{ phoneNumber: string }>('/auth/sms/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
  },

  // Проверить СМС код
  verifySms: (phoneNumber: string, code: string, referralCode?: string) => {
    const body = new URLSearchParams();
    body.append('phoneNumber', phoneNumber);
    body.append('code', code);
    if (referralCode) {
      body.append('referralCode', referralCode);
    }

    // Добавляем hash и phoneVerificationHash в ожидаемый ответ!
    return apiClient<{
      phoneNumber: string;
      code: string;
      referralCode?: string;
      hash?: string;
      phoneVerificationHash?: string;
    }>('/auth/sms/verify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
  },

  // Получить список заказов
  getOrders: (params: {
    organizationSlug: string;
    spotId: number;
    phone?: string;
  }) => {
    const queryParams: Record<string, string | number> = {
      organizationSlug: params.organizationSlug,
      spotId: params.spotId,
    };

    // Телефон опциональный, добавляем только если есть
    if (params.phone) {
      queryParams.phone = params.phone;
    }

    return apiClient<OrderList[]>('/orders/', { params: queryParams });
  },
};
