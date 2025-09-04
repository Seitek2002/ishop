import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Cart from 'pages/Cart';
import Main from 'pages/Main';
import NotFound from 'pages/NotFound';
import Order from 'pages/Order';
import SaveRefPage from 'pages/SaveRefPage/SaveRefPage';
import VenueGate from 'pages/VenueGate';
import ProtectedRoute from 'components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        {/* <Route path='/:venue' element={<SelectOrderType />} /> */}
        <Route path='/:venue' element={<VenueGate />} />
        <Route path='/:venue/ref/:ref' element={<SaveRefPage />} />
        <Route path='/:venue/:venueId/:id' element={<VenueGate />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/cart' element={<Cart />} />
        </Route>
        <Route path='/orders/:id' element={<Order />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
