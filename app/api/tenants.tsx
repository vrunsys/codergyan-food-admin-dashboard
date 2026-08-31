import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_AUTH_API;
const REFRESH_ATTEMPTS = 3;

const getTenants = async () => {
  return await fetch(`${BASE_URL}/tenants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};

const useTenants = () => {
  const tenants = async () => {
    const response = await getTenants();
    if (!response.ok) {
      return null;
    }
    return await response.json();
  };

  const { data: tenantsData, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenants,
    retry: REFRESH_ATTEMPTS,
  });
  return { tenantsData, isLoading, error };
};

export { getTenants, useTenants };
