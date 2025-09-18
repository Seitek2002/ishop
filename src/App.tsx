import AppRoutes from './router';
import { useGetClientBonusQuery } from 'api/Client.api';
import { useAppSelector } from 'hooks/useAppSelector';
import { loadUsersDataFromStorage } from 'utils/storageUtils';

import './App.scss';

function App() {
  const usersPhone = useAppSelector((state) => state.yourFeature.usersData?.phoneNumber);

  // Prefetch client bonus via RTKQ hook (cached globally)
  const storedPhone = (loadUsersDataFromStorage()?.phoneNumber || '').trim();
  const phone = (usersPhone || storedPhone).trim();
  const organizationSlug = useAppSelector((state) => state.yourFeature.venue?.slug);
  useGetClientBonusQuery({ phone, organizationSlug }, { skip: !phone || !organizationSlug });

  return <AppRoutes />;
}

export default App;
