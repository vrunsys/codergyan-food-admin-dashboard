import { useLayoutEffect, type FC } from 'react';
import { Outlet } from 'react-router';
import { useSelf } from '~/api/AuthApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '~/store/userSlice';


const RootLayout: FC = () => {
  const { selfData, isSuccess, isLoading } = useSelf();
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (!isSuccess) return <div>Error</div>;
  
  useLayoutEffect(() => {
    dispatch(setUser(selfData));
  }, [selfData, dispatch])
  
  
  
  return <Outlet />
};

export default RootLayout;