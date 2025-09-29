import { useEffect } from 'react';

import AppRoutes from './router';
import { useGetClientBonusQuery } from 'api/Client.api';
import { useAppSelector } from 'hooks/useAppSelector';
import { addGlobalHaptics } from 'utils/haptics';
import { loadUsersDataFromStorage } from 'utils/storageUtils';

import './App.scss';

function App() {
  const usersPhone = useAppSelector((state) => state.yourFeature.usersData?.phoneNumber);

  // Global haptics: vibrate on any click (capture), throttled
  useEffect(() => addGlobalHaptics(10, 80), []);

  // Prefetch client bonus via RTKQ hook (cached globally)
  const storedPhone = (loadUsersDataFromStorage()?.phoneNumber || '').trim();
  const phone = (usersPhone || storedPhone).trim();
  const organizationSlug = useAppSelector((state) => state.yourFeature.venue?.slug);
  useGetClientBonusQuery({ phone, organizationSlug }, { skip: !phone || !organizationSlug });

  return <AppRoutes />;
}

export default App;
