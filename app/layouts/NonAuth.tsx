
import type { FC } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useLocation } from 'react-router';

const NonAuthLayout: FC = () => {
  const { user } = useSelector((state: RootState) => state.user)
  const location = useLocation();
  
  if (user !== null) {
    const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
    return <Navigate to={`${returnTo}`} replace/>;
  }
  
  return <Outlet />;
};

export default NonAuthLayout;