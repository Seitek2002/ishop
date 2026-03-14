import {
  Clock,
  Package,
  Warehouse,
  Percent,
  Megaphone,
  Zap,
  Brain,
  Users,
  BarChart3,
  Link2,
  Award,
} from 'lucide-react';
import { BRAND } from '@/shared/config/theme';

const features = [
  {
    icon: Clock,
    title: 'Продажи 24/7',
    description:
      'Ваш магазин работает круглосуточно без выходных, принимая заказы в любое время',
  },
  {
    icon: Package,
    title: 'Точный товарный учёт',
    description:
      'Полный контроль над движением товаров с автоматическим обновлением остатков',
  },
  {
    icon: Warehouse,
    title: 'Умное управление складом',
    description:
      'Автоматизированная система контроля остатков и уведомлений о необходимости пополнения',
  },
  {
    icon: Percent,
    title: 'Скидки и бонусы',
    description:
      'Гибкая система скидок, промокодов и программа лояльности для ваших клиентов',
  },
  {
    icon: Megaphone,
    title: 'Автоматизация маркетинга',
    description: 'Умные рассылки, напоминания, акции и бонусная программа',
  },
  {
    icon: Zap,
    title: 'Ускорение процессов',
    description:
      'Автоматическая обработка заказов, формирование документов и отчетов',
  },
  {
    icon: Brain,
    title: 'Встроенные AI-инструменты',
    description:
      'Искусственный интеллект для улучшения фото, разнавания накладных, общения с клиентами и т.д.',
    highlight: true,
  },
  {
    icon: Users,
    title: 'Запоминание покупателей',
    description:
      'Система профилей клиентов с историей покупок и персональными предпочтениями',
  },
  {
    icon: BarChart3,
    title: 'Сбор данных и аналитика',
    description:
      'Подробная статистика продаж, поведения клиентов и эффективности маркетинга',
  },
  {
    icon: Link2,
    title: 'Интеграции',
    description:
      'Подключение CRM, складских систем, логистики, платежных шлюзов и мессенджеров',
  },
  {
    icon: Award,
    title: 'Укрепление бренда',
    description: 'Полная кастомизация дизайна магазина под ваш фирменный стиль',
  },
];

export const FeaturesList = () => {
  return (
    <section id='features' className='py-16 sm:py-24 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-12 sm:mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6'>
            Всё необходимое для успешных продаж
          </h2>
          <p className='text-lg sm:text-xl text-gray-600'>
            11 мощных инструментов для роста вашего бизнеса в одной платформе
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-6 sm:p-8 bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  feature.highlight
                    ? 'ring-2'
                    : 'shadow-md hover:shadow-gray-100'
                }`}
                style={
                  feature.highlight
                    ? { boxShadow: `0 0 0 2px ${BRAND.base}` }
                    : undefined
                }
              >
                {feature.highlight && (
                  <div
                    className='absolute -top-3 -right-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})`,
                    }}
                  >
                    NEW
                  </div>
                )}

                <div
                  className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-6 transition-all duration-300`}
                  style={{
                    backgroundColor: feature.highlight
                      ? BRAND.base
                      : BRAND.light100,
                  }}
                >
                  <Icon
                    className='w-6 h-6 sm:w-7 sm:h-7'
                    style={{ color: feature.highlight ? '#fff' : BRAND.base }}
                  />
                </div>

                <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
