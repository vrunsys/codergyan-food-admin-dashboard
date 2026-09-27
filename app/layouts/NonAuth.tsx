import type { FC } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const ADMIN_ONLY_ROUTES = ['/users'];

const NonAuthLayout: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (user !== null) {
    const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
    const isAdminOnly = ADMIN_ONLY_ROUTES.some((route) => returnTo.startsWith(route));
    const safePath = isAdminOnly && user.role !== 'ADMIN' ? '/' : returnTo;
    return <Navigate to={safePath} replace />;
  }

  return <Outlet />;
};

export default NonAuthLayout;