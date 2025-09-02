import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Cart from 'pages/Cart';
import Home from 'pages/Home';
import Main from 'pages/Main';
import Order from 'pages/Order';
import SaveRefPage from 'src/pages/SaveRefPage/SaveRefPage';
import ProtectedRoute from 'components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        {/* <Route path='/:venue' element={<SelectOrderType />} /> */}
        <Route path='/:venue' element={<Home />} />
        <Route path='/:venue/ref/:ref' element={<SaveRefPage />} />
        <Route path='/:venue/:venueId/:id' element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/cart' element={<Cart />} />
        </Route>
        <Route path='/orders/:id' element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
