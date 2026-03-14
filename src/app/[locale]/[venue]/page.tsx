import { Catalog } from '@/widgets/catalog/ui';
import { Categories } from '@/widgets/categories/ui';
// import { Hero } from '@/widgets/hero/ui';
// import { Categories } from '@/widgets/categories/ui';
// import { Catalog } from '@/widgets/catalog/ui';
// import { DesktopCart } from '@/widgets/desktop-cart/ui';

export default async function VenuePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; venue: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { venue } = await params;

  // Достаем параметры из URL (ждем промис в Next.js 15+)
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams.categoryId
    ? Number(resolvedSearchParams.categoryId)
    : 0;
  const searchQuery =
    typeof resolvedSearchParams.search === 'string'
      ? resolvedSearchParams.search
      : '';

  return (
    <div className='flex gap-8 items-start w-full pb-20'>
      {/* Левая колонка: Баннеры, Категории, Товары */}
      <div className='w-full lg:w-[65%] flex flex-col gap-6'>
        {/* <Hero venueSlug={venue} /> */}

        <Categories venueSlug={venue} selectedCategoryId={categoryId} />

        <Catalog
          venueSlug={venue}
          categoryId={categoryId}
          searchQuery={searchQuery}
        />
      </div>

      {/* Правая колонка: Десктопная корзина (Adaptivement из старого кода) */}
      <div className='hidden lg:block lg:w-[35%] sticky top-24'>
        {/* <DesktopCart /> */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-400'>
          Здесь будет корзина
        </div>
      </div>
    </div>
  );
}
