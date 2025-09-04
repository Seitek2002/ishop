import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import notFoundImg from 'assets/images/not-found-products.png';

import './style.scss';

const NotFound: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className='not-found'>
      <div className='not-found__card'>
        <div className='not-found__image'>
          <img src={notFoundImg} alt='404' />
        </div>
        <h1 className='not-found__title'>404</h1>
        <p className='not-found__subtitle'>Страница не найдена</p>
        <p className='not-found__desc'>
          Запрошенная страница не существует или недоступна. Проверьте ссылку или вернитесь на главную страницу.
        </p>
        <button
          type='button'
          className='not-found__button'
          onClick={() => navigate('/')}
        >
          {t('main') || 'На главную'}
        </button>
      </div>
    </section>
  );
};

export default NotFound;
