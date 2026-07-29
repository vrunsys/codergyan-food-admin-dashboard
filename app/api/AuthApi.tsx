import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API

type SignInData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
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

  const { mutate: signIn } = useMutation({
    mutationKey: ['signIn'],
    mutationFn: signInReq,
    onSuccess: async () => {
      await queryClient.fetchQuery({ queryKey: ['self'] });
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

  const { data: selfData, } = useQuery({
    queryKey: ['self'],
    queryFn: selfReq,
    enabled: false,
    retry: false,
  })
  return { selfData };
}