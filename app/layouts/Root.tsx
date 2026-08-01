import { useLayoutEffect, type FC } from 'react';
import { Outlet } from 'react-router';
import { useSelf } from '~/api/AuthApi';
import { useDispatch } from 'react-redux';
import { setUser } from '~/store/userSlice';


const RootLayout: FC = () => {
  const { selfData, isSuccess, isLoading } = useSelf();
  const dispatch = useDispatch();
  
  useLayoutEffect(() => {
    if (isSuccess && selfData) {
      dispatch(setUser({
        id: selfData.id,
        firstName: selfData.firstName,
        lastName: selfData.lastName,
        email: selfData.email,
        role: selfData.role,
        tenants: selfData.tenants || null,
      }));
    }
  }, [selfData, dispatch, isSuccess]);
  
  if (isLoading) return <div>Loading...</div>;
  
  return <Outlet />;
};

export default RootLayout;
