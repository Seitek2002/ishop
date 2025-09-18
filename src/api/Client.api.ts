import { baseApi } from './base';

export interface IClientBonus {
  phoneNumber: string;
  bonus: number;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientBonus: builder.query<IClientBonus, { phone: string; organizationSlug?: string; venueSlug?: string }>({
      query: ({ phone, organizationSlug, venueSlug }) => ({
        url: 'client/bonus',
        method: 'GET',
        params: {
          phone,
          ...(organizationSlug ? { organization_slug: organizationSlug } : {}),
          ...(venueSlug ? { venue_slug: venueSlug } : {}),
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetClientBonusQuery } = clientApi;
