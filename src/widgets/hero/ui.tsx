import { ArrowRight, Sparkles } from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

export const Hero = () => {
  return (
    <section className='relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden'>
      <div
        className='absolute inset-0 bg-linear-to-br'
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark}, ${BRAND.baseDarker})`,
        }}
      />
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 sm:mb-8'>
            <Sparkles className='w-4 h-4' style={{ color: '#FDE68A' }} />
            <span className='text-white text-sm font-medium'>
              Платформа нового поколения
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight'>
            Ваш брендированный интернет-магазин за 1 день
            <span
              className='block mt-2 pb-2 bg-clip-text text-transparent'
              style={{
                backgroundImage: 'linear-gradient(to right, #FDE68A, #F9A8D4)',
              }}
            >
              с iShop.kg
            </span>
          </h1>

          <p
            className='text-lg sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed'
            style={{ color: '#E7DFF0' }}
          >
            Мы умеем общаться с клиентами, принимать заказы и обрабатывать,
            разбивать накладные и автозаполнение, следить за работой продавцов
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <a
              href='#contact'
              className='w-full sm:w-auto px-8 py-4 bg-white font-semibold rounded-lg transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2'
              style={{ color: BRAND.base }}
            >
              <span>Начать бесплатно</span>
              <ArrowRight className='w-5 h-5' />
            </a>
            <a
              href='#features'
              className='w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all'
            >
              Узнать больше
            </a>
          </div>

          <div className='mt-12 sm:mt-16 grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto'>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl font-bold text-white mb-1'>
                24/7
              </div>
              <div className='text-sm' style={{ color: '#D9CDE7' }}>
                Продажи
              </div>
            </div>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl font-bold text-white mb-1'>
                AI
              </div>
              <div className='text-sm' style={{ color: '#D9CDE7' }}>
                Инструменты
              </div>
            </div>
            <div className='text-center'>
              <div className='text-3xl sm:text-4xl font-bold text-white mb-1'>
                ∞
              </div>
              <div className='text-sm' style={{ color: '#D9CDE7' }}>
                Интеграции
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
