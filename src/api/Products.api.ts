import { IProduct } from 'src/types/products.types';

import { baseApi } from './base';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      IProduct[],
      {
        category?: number;
        search?: string;
        spotSlug?: string;
        venueSlug?: string;
      }
    >({
      query: ({ category, search, spotSlug, venueSlug }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', String(category));
        if (search) params.append('search', search);
        if (spotSlug) params.append('spotId', spotSlug);
        if (venueSlug) params.append('organizationSlug', venueSlug);

        return `products/?${params.toString()}`;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery } = productsApi;
