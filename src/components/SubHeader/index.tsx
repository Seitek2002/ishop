import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useGetClientBonusQuery } from 'api/Client.api';
import { useGetVenueQuery } from 'api/Venue.api';
import {
  loadUsersDataFromStorage,
  loadVenueFromStorage,
} from 'utils/storageUtils';
import { getTodayScheduleInfo } from 'utils/timeUtils';
import WeeklyScheduleModal from 'components/WeeklyScheduleModal';

import './style.scss';

import { Calendar, Coins } from 'lucide-react';
import { clearCart, setVenue } from 'src/store/yourFeatureSlice';

const SubHeader = () => {
  const { venue, id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data } = useGetVenueQuery({
    venueSlug: venue || '',
    tableId: Number(id) || undefined,
  });

  useEffect(() => {
    if (data) dispatch(setVenue(data));
  }, [data, dispatch]);

  useEffect(() => {
    const loadedVenue = loadVenueFromStorage();
    if (loadedVenue.companyName !== venue) {
      dispatch(clearCart());
    }
  }, [venue, dispatch]);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const phoneForBonus = useMemo(() => {
    try {
      const u = loadUsersDataFromStorage();
      return (u?.phoneNumber || '').trim();
    } catch {
      return '';
    }
  }, []);

  const { data: bonusData } = useGetClientBonusQuery(
    { phone: phoneForBonus, organizationSlug: data?.slug || venue },
    { skip: !phoneForBonus || !(data?.slug || venue) }
  );

  const scheduleDisplay = useMemo(() => {
    const info = getTodayScheduleInfo(
      data?.schedules,
      data?.schedule,
      t('dayOff')
    );
    return `${info.text}`;
  }, [data?.schedules, data?.schedule, t]);

  return (
    <div className='sub-header'>
      <div className='sub-header__content'>
        <div className='venue'>
          <div className='logo'>
            <img src={data?.logo || undefined} alt='' />
          </div>
          <div>
            <div className='name' title={data?.companyName}>
              {data?.companyName}
            </div>
            <span className='schedule' title={scheduleDisplay}>
              {scheduleDisplay}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between md:gap-[12px] md:flex-initial'>
          <div className='call' title='Баллы'>
            <span className='text-[14px] font-bold text-center flex items-center gap-[8px]'>
              <Coins size={20} />
              <span className='mt-[4px]'>{bonusData?.bonus ?? 0} б.</span>
            </span>
          </div>
          <div
            className='call cursor-pointer'
            role='button'
            aria-label='График работы'
            onClick={() => setIsScheduleOpen(true)}
          >
            <Calendar size={20} />
          </div>
          {data?.table?.tableNum && (
            <div className='table'>Стол №{data.table.tableNum}</div>
          )}
        </div>
      </div>

      <WeeklyScheduleModal
        isShow={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        schedules={data?.schedules}
        fallbackSchedule={data?.schedule}
      />
    </div>
  );
};

export default SubHeader;
