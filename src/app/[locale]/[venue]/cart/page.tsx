import { shopApi } from '@/shared/api/shop';
import { CartClient } from '@/widgets/cart/ui/CartClient';
// Путь зависит от того, куда ты положил клиентский компонент из Шага 1

interface PageProps {
  params: {
    venue: string;
    locale: string;
  };
}

// Это Серверный Компонент (без 'use client')
export default async function CartRoute({ params }: PageProps) {
  // 1. Достаем slug из URL (В Next.js 15 params нужно await'ить, если версия 14 - await не нужен, но он не повредит)
  const resolvedParams = await params;

  // 2. Делаем запрос на сервер за данными заведения
  const venue = await shopApi.getOrganization(resolvedParams.venue);

  // 3. Если заведение не найдено, можно показать 404
  if (!venue) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <h1 className='text-xl font-bold'>Заведение не найдено</h1>
      </div>
    );
  }

  // 4. Передаем готовый объект venue в наш клиентский компонент!
  return <CartClient venue={venue} />;
}
