import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tenant } from "./tenants";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
const REFRESH_ATTEMPTS = 3;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenantId: number;
  tenants: Tenant;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: Role;
  tenantId: string;
}

export enum Role {
	CUSTOMER = "customer",
	MANAGER = "manager",
	ADMIN = "ADMIN", 
}

const getUsers = async (queryParams: { perPage: number; currentPage: number; q?: string | undefined; role?: Role | undefined }) => {
  const params = new URLSearchParams({
    perPage: queryParams.perPage.toString(),
    currentPage: queryParams.currentPage.toString(),
    ...(queryParams.q && {'q': queryParams.q}),
   ...(queryParams.role && {'role': queryParams.role}),
  })
  return await fetch(`${AUTH_API_URL}/users?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};

const createNewUser = async (user: NewUser) => {
  return await fetch(`${AUTH_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
    credentials: 'include',
    
  });
};

const updateUserApi = async (user: User) => {
  return await fetch(`${AUTH_API_URL}/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
    credentials: 'include',
  });
};

export const useUsers = (queryParams: { perPage: number; currentPage: number; q?: string; role?: Role }) => {
  const users = async () => {
    const response = await getUsers(queryParams);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  };

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: users,
    retry: REFRESH_ATTEMPTS,
  })
  return { usersData, isLoading, error };
};

export const useCreateUser = () => {
  const create = async (user: NewUser) => {
    const response = await createNewUser(user);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  };

  const queryClient = useQueryClient();
  const { mutate: createUser, isError } = useMutation({
    mutationKey: ['createUser'],
    mutationFn: create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  })
  return { createUser, isError };
};

export const useUpdateUser = () => {
  const _update = async (user: User) => {
    const response = await updateUserApi(user);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  }
  const queryClient = useQueryClient();
  const { mutate: updateUser, isError } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: _update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  })
  return { updateUser, isError };
};


