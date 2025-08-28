import { ICategory } from 'src/types/categories.types';

import { baseApi } from './base';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], { venueSlug?: string }>({
      query: ({ venueSlug }) => ({
        url: 'categories',
        method: 'GET',
        params: { organizationSlug: venueSlug },
      }),
    }),
    addCategories: builder.mutation<void, ICategory>({
      query: (newCategory) => ({
        url: 'posts',
        method: 'POST',
        body: newCategory,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCategoriesQuery, useAddCategoriesMutation } = categoriesApi;
