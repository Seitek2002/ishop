import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from 'hooks/useAppSelector';

// Reuse existing modal styles (overlay + clear-cart-modal)
import 'components/ClearCartModal/index.scss';

interface IProps {
  isShow: boolean;
  onClose: () => void;
}

const WorkTimeModal: FC<IProps> = ({ isShow, onClose }) => {
  const { t } = useTranslation();
  const colorTheme = useAppSelector(
    (state) => state.yourFeature.venue?.colorTheme
  );

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={onClose}
      ></div>
      <div className={isShow ? 'clear-cart-modal active' : 'clear-cart-modal'}>
        <h3 className='text-[20px] font-medium mb-2'>
          {t('nonWorkingTime.title')}
        </h3>
        <p className='text-[#80868B] mb-4'>
          {t('nonWorkingTime.description')}
        </p>
        <div className='clear-cart-modal__btns'>
          <button
            className='text-white'
            style={{ backgroundColor: colorTheme }}
            onClick={onClose}
          >
            {t('button.close')}
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkTimeModal;
