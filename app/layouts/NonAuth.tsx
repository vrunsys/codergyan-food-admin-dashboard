
import type { FC } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const NonAuthLayout: FC = () => {
  const {user} = useSelector((state: RootState) => state.user)
  if (user !== null) return <Navigate to={'/'} replace/>;
  return <Outlet />;
};

export default NonAuthLayout;