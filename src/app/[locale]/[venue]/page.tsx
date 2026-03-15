import { Catalog } from '@/widgets/catalog/ui';
import { Categories } from '@/widgets/categories/ui';
import { DesktopCart } from '@/widgets/desktop-cart/ui';
import { StatusHero } from '@/widgets/status-hero/ui';
import { shopApi } from '@/shared/api/shop';

export default async function VenuePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; venue: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { venue: venueSlug } = await params;

  const venueData = await shopApi.getOrganization(venueSlug);

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
      <div className='w-full lg:w-[65%] flex flex-col gap-6'>
        <StatusHero venue={venueData} />

        <Categories venueSlug={venueSlug} selectedCategoryId={categoryId} />

        <Catalog
          venueSlug={venueSlug}
          categoryId={categoryId}
          searchQuery={searchQuery}
        />
      </div>

      <div className='hidden lg:block lg:w-[35%] sticky top-24'>
        <DesktopCart venue={venueData} />
      </div>
    </div>
  );
}
