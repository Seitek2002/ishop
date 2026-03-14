'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Используем useState, чтобы QueryClient создавался только один раз
  // при первом рендере компонента на клиенте
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Данные считаются "свежими" 1 минуту, чтобы не спамить API лишними запросами
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false, // Не перезапрашивать при переключении вкладок браузера
            retry: 1, // Делать только 1 повторную попытку при ошибке
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
