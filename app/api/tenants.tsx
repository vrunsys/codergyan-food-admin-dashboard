import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_AUTH_API;
const REFRESH_ATTEMPTS = 3;

export interface Tenant {
  id: string;
  name: string;
  
}

export interface NewTenant {
  name: string;
  address: string;
}

const getTenants = async (queryParams: { perPage: number; currentPage: number; q?: string }) => {
  const params = new URLSearchParams({
    perPage: queryParams.perPage.toString(),
    currentPage: queryParams.currentPage.toString(),
    ...(queryParams.q ? { q: queryParams.q } : {}),
  });
  return await fetch(`${BASE_URL}/tenants?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};

const createNewTenant = async (tenant: NewTenant) => {
  return await fetch(`${BASE_URL}/tenants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tenant),
    credentials: 'include',
  });
};

const useTenants = (queryParams: { perPage: number; currentPage: number; q?: string }) => {
  const tenants = async () => {
    const response = await getTenants(queryParams);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  };

  const { data: tenantsData, isLoading, error } = useQuery({
    queryKey: ['tenants', queryParams],
    queryFn: tenants,
    retry: REFRESH_ATTEMPTS,
  });
  return { tenantsData, isLoading, error };
};

const useNewTenant = () => {
  const create = async (tenant: NewTenant) => {
    const response = await createNewTenant(tenant);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  };

  const queryClient = useQueryClient();
  const { mutate: createTenant, isError } = useMutation({
    mutationKey: ['createTenant'],
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  })
  
  return { createTenant, isError };
};

export { useTenants, useNewTenant };
