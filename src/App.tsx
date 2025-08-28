import { useEffect } from 'react';

import AppRoutes from './router';
import { useAppSelector } from 'hooks/useAppSelector';

import './App.scss';

function App() {
  const venue = useAppSelector((state) => state.yourFeature.venue);

  useEffect(() => {
    document.title = venue.companyName;
  }, [venue.companyName]);

  return <AppRoutes />;
}

export default App;
