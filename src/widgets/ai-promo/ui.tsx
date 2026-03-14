import { Brain } from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

export const AiPromo = () => {
  return (
    <div className='grid lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
      <div className='order-2 lg:order-1'>
        <div
          className='inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 sm:mb-6'
          style={{ backgroundColor: BRAND.light100 }}
        >
          <Brain className='w-4 h-4' style={{ color: BRAND.base }} />
          <span
            className='text-sm font-medium'
            style={{ color: BRAND.baseDark }}
          >
            AI-технологии
          </span>
        </div>
        <h3 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>
          Встроенные AI-инструменты
        </h3>
        <p className='text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'>
          Используйте мощь искусственного интеллекта для улучшения визуального
          контента, работы с документами и общения с клиентами. ИИ помогает
          автоматически обрабатывать фото товаров, распознавать накладные и
          ускорять ответы на запросы покупателей
        </p>
        <ul className='space-y-4'>
          {[
            'Улучшение фото товаров (автообработка, выравнивание фона, повышение качества)',
            'Распознавание накладных и документов с автозаполнением данных',
            'Умные ответы на вопросы клиентов в чате и мессенджерах',
            'Автоматическая генерация текстов: описания товаров и типовые ответы',
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
      <div className='order-1 lg:order-2'>
        <div className='relative'>
          <div
            className='absolute inset-0 rounded-3xl transform rotate-3'
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})`,
            }}
          />
          <div
            className='relative rounded-3xl p-8 sm:p-12 text-white'
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})`,
            }}
          >
            <Brain className='w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-90' />
            <div className='text-5xl sm:text-6xl font-bold mb-2'>95%</div>
            <div className='text-lg' style={{ color: '#E7DFF0' }}>
              точность прогнозов
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
