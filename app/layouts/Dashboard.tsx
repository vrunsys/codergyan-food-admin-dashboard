import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import type { RootState } from '../store';

const DashboardLayout: FC = () => {
  const {user} = useSelector((state: RootState) => state.user)
  if (user === null) return <Navigate to={'/auth/login'} replace/>;
  return (
    <div>
      Dashboard
      <Outlet />
    </div>
  );
};

export default DashboardLayout;