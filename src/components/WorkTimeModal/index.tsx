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
  const schedule =
    useAppSelector((state) => state.yourFeature.venue?.schedule) ||
    '00:00-00:00';

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={onClose}
      ></div>
      <div
        className={isShow ? 'clear-cart-modal active' : 'clear-cart-modal'}
        style={{
          width: 'calc(100vw - 64px)',
          maxWidth: '520px',
          height: 'auto',
          padding: '16px 24px',
        }}
      >
        <div className='w-full px-[16px] md:px-[24px]'>
          <h3 className='text-[20px] font-medium mb-2 text-center'>
            {t('nonWorkingTime.title')}
          </h3>
          <p className='text-[#80868B] mb-2 text-center'>
            {t('nonWorkingTime.description')}
          </p>
          <p className='text-[#80868B] mb-4 text-center'>
            {t('workSchedule')} {schedule}
          </p>
        </div>
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
