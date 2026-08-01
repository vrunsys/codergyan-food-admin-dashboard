
import type { FC } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

const NonAuthLayout: FC = () => {
  const {user} = useSelector((state) => state.user)
  if (user !== null) return <Navigate to={'/'} replace/>;
  return (
    <div>
      NonAuth
      <Outlet />
    </div>
  );
};

export default NonAuthLayout;