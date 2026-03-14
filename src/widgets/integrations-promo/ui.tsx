import { Shield } from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

export const IntegrationsPromo = () => {
  return (
    <div className='grid lg:grid-cols-2 gap-8 sm:gap-12 items-center'>
      <div className='order-2 lg:order-1'>
        <div
          className='inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 sm:mb-6'
          style={{ backgroundColor: BRAND.light100 }}
        >
          <Shield className='w-4 h-4' style={{ color: BRAND.base }} />
          <span
            className='text-sm font-medium'
            style={{ color: BRAND.baseDark }}
          >
            Интеграции
          </span>
        </div>
        <h3 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>
          Полная экосистема интеграций
        </h3>
        <p className='text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'>
          Подключите все необходимые сервисы и инструменты. CRM-системы,
          складской учет, логистические партнеры, платежные системы, мессенджеры
          и маркетинговые сервисы работают вместе в единой экосистеме.
        </p>
        <div className='grid grid-cols-2 gap-4'>
          {[
            ['CRM системы', '1C, Bitrix24, AmoCRM'],
            ['Платежи', 'QR платежи, Все банки КР'],
            ['Логистика', 'Яндекс GO, Glovo'],
            ['Мессенджеры', 'WhatsApp, Telegram, Instagram DM'],
          ].map(([title, text], i) => (
            <div key={i} className='p-4 bg-gray-50 rounded-xl'>
              <div className='font-semibold text-gray-900 mb-1'>{title}</div>
              <div className='text-sm text-gray-600'>{text}</div>
            </div>
          ))}
        </div>
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
            <Shield className='w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-90' />
            <div className='text-5xl sm:text-6xl font-bold mb-2'>50+</div>
            <div className='text-lg' style={{ color: '#E7DFF0' }}>
              готовых интеграций
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
