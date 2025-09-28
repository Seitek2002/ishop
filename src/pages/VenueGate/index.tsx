import { FC, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Home from 'pages/Home';
import NotFound from 'pages/NotFound';
import { useGetVenueQuery } from 'api/Venue.api';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import Loader from 'components/Loader';

import { setUsersData } from 'src/store/yourFeatureSlice';

const VenueGate: FC = () => {
  const { venue, venueId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usersData = useAppSelector((s) => s.yourFeature.usersData);

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

  // Set order mode by URL:
  // - "/:venue/:venueId/s" => pickup (type = 2) and set activeSpot = venueId
  // - "/:venue" => delivery (type = 3)
  // Note: table route is removed
  useEffect(() => {
    const isPickup = location.pathname.endsWith('/s');
    const spotId = venueId ? Number(venueId) : undefined;

    const nextType = isPickup ? 2 : 3; // 2: Самовывоз, 3: Доставка

    const nextUsers = {
      ...usersData,
      type: nextType,
      activeSpot:
        isPickup && typeof spotId === 'number' && !Number.isNaN(spotId)
          ? spotId
          : usersData?.activeSpot ?? 0,
    };

    if (usersData?.type !== nextUsers.type || usersData?.activeSpot !== nextUsers.activeSpot) {
      dispatch(setUsersData(nextUsers));
    }
  }, [location.pathname, venueId, usersData, dispatch]);

  const { data, isError, isLoading } = useGetVenueQuery({
    venueSlug: venue || '',
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
