import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
const REFRESH_ATTEMPTS = 3;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: string;
  tenantId: string;
}

export enum Role {
	CUSTOMER = "customer",
	MANAGER = "manager",
	ADMIN = "admin", 
}

const getUsers = async () => {
  return await fetch(`${AUTH_API_URL}/users`, {
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

export const useUsers = () => {
  const users = async () => {
    const response = await getUsers();
    if (!response.ok) {
      return null;
    }
    return await response.json();
  };

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
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
  const { mutate: createUser, isSuccess } = useMutation({
    mutationKey: ['createUser'],
    mutationFn: create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  })
  return { createUser, isSuccess };
};

