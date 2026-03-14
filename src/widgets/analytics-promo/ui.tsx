import { Target, TrendingUp } from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

export const AnalyticsPromo = () => {
  return (
    <div className='grid lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
      <div>
        <div className='relative'>
          <div
            className='absolute inset-0 rounded-3xl transform -rotate-3'
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})`,
            }}
          />
          <div
            className='relative bg-white border-2 rounded-3xl p-8 sm:p-12'
            style={{ borderColor: BRAND.light200 }}
          >
            <TrendingUp
              className='w-16 h-16 sm:w-20 sm:h-20 mb-6'
              style={{ color: BRAND.base }}
            />
            <div className='text-5xl sm:text-6xl font-bold text-gray-900 mb-2'>
              3x
            </div>
            <div className='text-lg text-gray-600'>рост конверсии</div>
          </div>
        </div>
      </div>
      <div>
        <div
          className='inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 sm:mb-6'
          style={{ backgroundColor: BRAND.light100 }}
        >
          <Target className='w-4 h-4' style={{ color: BRAND.base }} />
          <span
            className='text-sm font-medium'
            style={{ color: BRAND.baseDark }}
          >
            Аналитика
          </span>
        </div>
        <h3 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>
          Сбор данных и глубокая аналитика
        </h3>
        <p className='text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'>
          Получайте полное представление о вашем бизнесе. Отслеживайте ключевые
          метрики в реальном времени, анализируйте поведение клиентов и
          принимайте решения на основе данных.
        </p>
        <ul className='space-y-4'>
          {[
            'Дашборды с ключевыми метриками в реальном времени',
            'Анализ пути покупателя и точек выхода',
            'Когортный анализ и сегментация аудитории',
            'Автоматические отчеты и экспорт данных',
          ].map((txt, i) => (
            <li key={i} className='flex items-start space-x-3'>
              <div
                className='shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5'
                style={{ backgroundColor: BRAND.light100 }}
              >
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: BRAND.base }}
                />
              </div>
              <span className='text-gray-700'>{txt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
