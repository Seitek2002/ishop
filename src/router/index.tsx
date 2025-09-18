import { Helmet } from 'react-helmet';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Cart from 'pages/Cart';
import Main from 'pages/Main';
import NotFound from 'pages/NotFound';
import Order from 'pages/Order';
import SaveRefPage from 'pages/SaveRefPage/SaveRefPage';
import VenueGate from 'pages/VenueGate';
import { useAppSelector } from 'hooks/useAppSelector';
import ProtectedRoute from 'components/ProtectedRoute';

const MetaHelmet = () => {
  const venue = useAppSelector((s) => s.yourFeature.venue);
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const title = isRoot ? 'ishop' : (venue.companyName || 'ishop');
  const desc =
    (venue?.description && venue.description.trim()) ||
    (venue?.companyName ? `${venue.companyName} — онлайн-меню и заказы` : 'iShop — онлайн-меню и заказы');
  const faviconHref = isRoot ? '/favicon.svg' : (venue?.logo || '/favicon.svg');
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={desc} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={desc} />
      {!isRoot && venue?.logo ? <meta property='og:image' content={venue.logo} /> : null}
      <link rel='icon' href={faviconHref} />
    </Helmet>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MetaHelmet />
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
