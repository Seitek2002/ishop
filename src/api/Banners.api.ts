import { baseApi } from './base';

export interface IBanner {
  id: number;
  title: string;
  text: string;
  banner: string;
  image: string;
  url: string;
}

export const bannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<IBanner[], { organizationSlug: string }>({
      query: ({ organizationSlug }) => ({
        url: 'banners',
        method: 'GET',
        params: { organizationSlug },
      }),
    }),
    addBanner: builder.mutation<IBanner, Partial<IBanner>>({
      query: (newBanner) => ({
        url: 'banners',
        method: 'POST',
        body: newBanner,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBannersQuery, useAddBannerMutation } = bannersApi;
