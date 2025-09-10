import { FC, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Home from 'pages/Home';
import NotFound from 'pages/NotFound';
import { useGetVenueQuery } from 'api/Venue.api';
import Loader from 'components/Loader';

const VenueGate: FC = () => {
  const { venue, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Capture promo/ref from query and redirect to clean URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promo = params.get('promo');
    const ref = params.get('ref') ?? params.get('refId');

    if (promo) localStorage.setItem('promo', promo);
    if (ref) localStorage.setItem('refId', ref);

    if (promo || ref) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const { data, isError, isLoading } = useGetVenueQuery({
    venueSlug: venue || '',
    tableId: id ? Number(id) : undefined,
  });

  if (isLoading) {
    return (
      <div className='min-h-[60vh] w-full flex items-center justify-center'>
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    return <NotFound />;
  }

  return <Home />;
};

export default VenueGate;
