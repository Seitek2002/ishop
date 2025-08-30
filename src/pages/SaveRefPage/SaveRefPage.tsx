import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SaveRefPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem('ref', params.ref || '');
    navigate('/' + params.venue);
  }, []);

  return <div></div>;
};

export default SaveRefPage;
