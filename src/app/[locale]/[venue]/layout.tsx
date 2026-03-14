import { notFound } from 'next/navigation';
import { StoreHeader } from '@/widgets/store-header/ui';
import { shopApi } from '@/shared/api/shop';

export default async function VenueLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; venue: string }>;
}>) {
  const { venue } = await params;

  let organization;

  try {
    organization = await shopApi.getOrganization(venue);
  } catch {
    // Если API вернул 404 или упал, уводим на страницу NotFound
    notFound();
  }

  if (!organization) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-4 sm:px-6 lg:px-8 max-w-5xl'>
        <StoreHeader venue={organization} />

        <main className='mt-6'>{children}</main>
      </div>
    </div>
  );
}
