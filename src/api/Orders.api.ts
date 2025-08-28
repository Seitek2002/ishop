import { IOrder, IOrderById, IReqCreateOrder } from 'src/types/orders.types';

import { baseApi } from './base';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      IOrder[],
      {
        tableNum?: string;
        venueSlug?: string;
        spotSlug?: string;
        phone?: string;
      }
    >({
      query: ({ tableNum, venueSlug, spotSlug, phone }) => {
        const params = new URLSearchParams();
        if (tableNum) params.append('tableNum', tableNum);
        if (venueSlug) params.append('organizationSlug', venueSlug);
        if (spotSlug) params.append('spotId', spotSlug);
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
