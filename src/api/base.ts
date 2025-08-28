import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import i18n from 'i18next';

const baseUrl = 'https://ishop.kg/api/';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const currentLanguage =
        i18n.language || localStorage.getItem('i18nextLng') || 'en';
      headers.set('Accept-Language', currentLanguage);
      return headers;
    },
  }),
  endpoints: () => ({}),
});
