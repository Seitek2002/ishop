import { IOrder, IOrderById, IReqCreateOrder } from 'src/types/orders.types';

import { baseApi } from './base';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      IOrder[],
      {
        // New schema fields
        organizationSlug?: string;
        spotId?: string | number;
        phone?: string;
        // Backward compatibility with older code paths:
        venueSlug?: string;
        spotSlug?: string | number;
      }
    >({
      query: ({ organizationSlug, spotId, phone, venueSlug, spotSlug }) => {
        const params = new URLSearchParams();
        const org = organizationSlug ?? venueSlug;
        const spot = (spotId ?? spotSlug) as string | number | undefined;

        if (org) params.append('organizationSlug', String(org));
        if (spot !== undefined && spot !== null) params.append('spotId', String(spot));
        if (phone) params.append('phone', phone);

        return `orders/?${params.toString()}`;
      },
    }),
    postOrders: builder.mutation<{ paymentUrl: string }, IReqCreateOrder>({
      query: (newOrder) => ({
        url: 'orders/',
        method: 'POST',
        body: newOrder,
      }),
    }),
    getOrdersById: builder.query<IOrderById, { id: number }>({
      query: ({ id }) => `orders/${id}/`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  usePostOrdersMutation,
  useGetOrdersByIdQuery,
  useLazyGetOrdersByIdQuery,
} = ordersApi;
