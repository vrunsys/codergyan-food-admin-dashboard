import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_AUTH_API;
const AUTH_SERVICE = "api/auth";

export interface Tenant {
  id: string;
  name: string;
}

export interface NewTenant {
  name: string;
  address: string;
}

const getTenants = async (queryParams: {
  perPage: number;
  currentPage: number;
  q?: string;
}) => {
  const params = new URLSearchParams({
    perPage: queryParams.perPage.toString(),
    currentPage: queryParams.currentPage.toString(),
    ...(queryParams.q ? { q: queryParams.q } : {}),
  });

  const response = await fetch(`${BASE_URL}/${AUTH_SERVICE}/tenants?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tenants");
  }

  return response.json();
};

const createNewTenant = async (tenant: NewTenant) => {
  const response = await fetch(`${BASE_URL}/${AUTH_SERVICE}/tenants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tenant),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create tenant");
  }

  return response.json();
};

const useTenants = (queryParams: { perPage: number; currentPage: number; q?: string }) => {
  const { data: tenantsData, isLoading, error } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => getTenants(queryParams),
  });

  return { tenantsData, isLoading, error };
};

const useNewTenant = () => {
  const queryClient = useQueryClient();

  const { mutate: createTenant, isError } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: createNewTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  return { createTenant, isError };
};

const getAllTenants = async () => {
  const response = await fetch(`${BASE_URL}/${AUTH_SERVICE}/tenants`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tenants");
  }

  return response.json();
};

export const useAllTenants = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tenants", "all"],
    queryFn: getAllTenants,
  });

  // Normalise: API may return { data: [...] }, { tenants: [...] }, or a bare array
  const tenantsOptions: Tenant[] = Array.isArray(data)
    ? data
    : (data?.data ?? data?.tenants ?? []);

  return { tenantsOptions, isLoading, error };
};

export { useTenants, useNewTenant };
