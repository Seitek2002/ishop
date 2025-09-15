import { useEffect } from 'react';

import AppRoutes from './router';
import { useGetClientBonusQuery } from 'api/Client.api';
import { useAppSelector } from 'hooks/useAppSelector';
import { loadUsersDataFromStorage } from 'utils/storageUtils';

import './App.scss';

function App() {
  const venue = useAppSelector((state) => state.yourFeature.venue);
  const usersPhone = useAppSelector((state) => state.yourFeature.usersData?.phoneNumber);

  // Prefetch client bonus via RTKQ hook (cached globally)
  const storedPhone = (loadUsersDataFromStorage()?.phoneNumber || '').trim();
  const phone = (usersPhone || storedPhone).trim();
  useGetClientBonusQuery({ phone }, { skip: !phone });

  useEffect(() => {
    document.title = venue.companyName;
  }, [venue.companyName]);

  return <AppRoutes />;
}

export default App;
