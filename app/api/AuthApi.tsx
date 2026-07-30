import { useMutation, useQueryClient, useQuery, useMutationState } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout, setUser, type User } from "~/store/userSlice";
import usePermissions from "~/hooks/usePermissions";



const AUTH_API_URL = import.meta.env.VITE_AUTH_API

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
    },
  })
  return { signIn };
}

export const useSelf = () => {
  const selfReq = async () => {
    const response = await fetch(`${AUTH_API_URL}/auth/self`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get self');
    }

    const result = await response.json();
    return result;
  };

  const { data: selfData, isSuccess } = useQuery({
    queryKey: ['self'],
    queryFn: selfReq,
    enabled: false,
    retry: false,
  });

  return { selfData };
}

export const useLogout = () => {
  
  const logoutReq = async () => {
    const response = await fetch(`${AUTH_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

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