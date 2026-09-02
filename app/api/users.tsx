import { useQuery } from "@tanstack/react-query";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
const REFRESH_ATTEMPTS = 3;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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

