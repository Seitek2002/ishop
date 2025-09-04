import { FC } from 'react';
import { useParams } from 'react-router-dom';

import Home from 'pages/Home';
import NotFound from 'pages/NotFound';
import { useGetVenueQuery } from 'api/Venue.api';
import Loader from 'components/Loader';

const VenueGate: FC = () => {
  const { venue, id } = useParams();

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
