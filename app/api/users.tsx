import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tenant } from "./tenants";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
const AUTH_SERVICE = "api/auth";

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

const getUsers = async (queryParams: {
  perPage: number;
  currentPage: number;
  q?: string;
  role?: Role;
}) => {
  const params = new URLSearchParams({
    perPage: queryParams.perPage.toString(),
    currentPage: queryParams.currentPage.toString(),
    ...(queryParams.q && { q: queryParams.q }),
    ...(queryParams.role && { role: queryParams.role }),
  });

  const response = await fetch(`${AUTH_API_URL}/${AUTH_SERVICE}/users?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

const createNewUser = async (user: NewUser) => {
  const response = await fetch(`${AUTH_API_URL}/${AUTH_SERVICE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

const updateUserApi = async (user: User) => {
  const response = await fetch(`${AUTH_API_URL}/${AUTH_SERVICE}/users/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

export const useUsers = (queryParams: {
  perPage: number;
  currentPage: number;
  q?: string;
  role?: Role;
}) => {
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => getUsers(queryParams),
  });

  return { usersData, isLoading, error };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const { mutate: createUser, isError } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: createNewUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { createUser, isError };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isError } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { updateUser, isError };
};
