const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://твой-домен/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export const apiClient = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { params, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...customConfig.headers,
    },
  });

  if (!response.ok) {
    // Здесь позже можно добавить нормальную обработку ошибок
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};
