import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout, setUser, type User } from "~/store/userSlice";
import usePermissions from "~/hooks/usePermissions";
import { useNavigate } from "react-router";



const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
const REFRESH_ATTEMPTS = 3;

const requestSelf = async () =>
  await fetch(`${AUTH_API_URL}/auth/self`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

const refreshAccessToken = async () => {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < REFRESH_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) return;

      lastError = new Error('Failed to refresh access token');
    } catch (error) {
      lastError = error instanceof Error
        ? error
        : new Error('Failed to refresh access token');
    }
  }

  throw lastError ?? new Error('Failed to refresh access token');
};

const requestLogout = async () =>
  await fetch(`${AUTH_API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

type SignInData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const signInReq = async (data: SignInData) => {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to sign in');
    }

    const result = await response.json();
    return result;
  };

  const { isAllowed } = usePermissions();
  const { logoutMutate } = useLogout();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: signIn } = useMutation({
    mutationKey: ['signIn'],
    mutationFn: signInReq,
    onSuccess: async () => {
      const selfData = await queryClient.fetchQuery({ queryKey: ['self'] });
      const user = await selfData as User;
      if(!isAllowed(user)) {
        logoutMutate();
        return;
      }
      dispatch(setUser(selfData as User));
      navigate('/');
    },
  })
  return { signIn };
}

export const useSelf = () => {
  const selfReq = async () => {
    let response = await requestSelf();

    if (response.status === 401) {
      await refreshAccessToken();
      response = await requestSelf();
    }

    if (!response.ok) {
      throw new Error('Failed to get self');
    }

    const result = await response.json() as User;
    return result;
  };

  const { data: selfData, isSuccess, isLoading } = useQuery({
    queryKey: ['self'],
    queryFn: selfReq,
    retry: false,
  });

  return { selfData, isSuccess, isLoading, };
}

export const useLogout = () => {

  const logoutReq = async () => {
    let response = await requestLogout();

     if (response.status === 401) {
      await refreshAccessToken();
      response = await requestLogout();
    }

    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    const result = await response.json();
    return result;
  };

  const dispatch = useDispatch();
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logoutReq,
    onSuccess: () => {
      dispatch(logout());
    },
  });
  return { logoutMutate };
}
