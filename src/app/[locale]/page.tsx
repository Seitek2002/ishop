import { Header } from '@/widgets/header/ui';
import { Hero } from '@/widgets/hero/ui';
import { FeaturesList } from '@/widgets/features-list/ui';
import { AiPromo } from '@/widgets/ai-promo/ui';
import { AnalyticsPromo } from '@/widgets/analytics-promo/ui';
import { IntegrationsPromo } from '@/widgets/integrations-promo/ui';
import { LeadForm } from '@/features/lead-form/ui';
import { Footer } from '@/widgets/footer/ui';

export default function Page() {
  return (
    <div className='bg-white min-h-screen'>
      <Header />

      <main>
        <Hero />
        <FeaturesList />

        {/* Detailed Features */}
        <section className='py-16 sm:py-24 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32'>
            <AiPromo />
            <AnalyticsPromo />
            <IntegrationsPromo />
          </div>
        </section>

        {/* Contact */}
        <section
          id='contact'
          className='py-16 sm:py-24 relative overflow-hidden bg-linear-to-br from-[#854C9D] to-[#4a2b63]'
        >
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl' />
            <div className='absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl' />
          </div>

          <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='max-w-4xl mx-auto'>
              <div className='text-center mb-12 sm:mb-16'>
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6'>
                  Начните зарабатывать больше уже сегодня
                </h2>
                <p className='text-lg sm:text-xl max-w-2xl mx-auto text-[#E7DFF0]'>
                  Оставьте заявку, и наш специалист свяжется с вами для
                  демонстрации платформы
                </p>
              </div>

              <div className='bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12'>
                <LeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
