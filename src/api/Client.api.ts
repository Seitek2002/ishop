import { baseApi } from './base';

export interface IClientBonus {
  phoneNumber: string;
  bonus: number;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientBonus: builder.query<IClientBonus, { phone: string }>({
      query: ({ phone }) => ({
        url: 'client/bonus',
        method: 'GET',
        params: { phone },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientBonusQuery } = clientApi;
