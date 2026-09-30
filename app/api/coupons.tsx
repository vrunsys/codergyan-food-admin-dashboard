import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ORDERS_API_URL = import.meta.env.VITE_AUTH_API;
const ORDERS_SERVICE = "api/orders";

export interface Coupon {
  _id: string;
  title: string;
  code: string;
  discount: number;
  validUpto: string;
  tenantId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponPayload {
  title: string;
  code: string;
  discount: number;
  validUpto: string;
  tenantId?: number;
}

const readError = async (response: Response, fallback: string) => {
  try {
    const payload = await response.json();
    const message = payload?.errors?.[0]?.msg;
    if (message) return message;
  } catch {
    // fall through to the default message
  }
  return fallback;
};

const getCoupons = async (tenantId?: number) => {
  const params = tenantId ? `?tenantId=${tenantId}` : "";
  const response = await fetch(`${ORDERS_API_URL}/${ORDERS_SERVICE}/coupons${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch coupons"));
  }

  return response.json();
};

const createCouponApi = async (coupon: CouponPayload) => {
  const response = await fetch(`${ORDERS_API_URL}/${ORDERS_SERVICE}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(coupon),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to create coupon"));
  }

  return response.json();
};

const updateCouponApi = async ({ _id, ...coupon }: CouponPayload & { _id: string }) => {
  const response = await fetch(
    `${ORDERS_API_URL}/${ORDERS_SERVICE}/coupons/${_id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(coupon),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update coupon"));
  }

  return response.json();
};

const deleteCouponApi = async (id: string) => {
  const response = await fetch(
    `${ORDERS_API_URL}/${ORDERS_SERVICE}/coupons/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to delete coupon"));
  }

  return response.json();
};

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => () => {
  queryClient.invalidateQueries({ queryKey: ["coupons"] });
};

export const useCoupons = (tenantId?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["coupons", { tenantId }],
    queryFn: () => getCoupons(tenantId),
  });

  const coupons: Coupon[] = Array.isArray(data?.coupons) ? data.coupons : [];

  return { coupons, isLoading, error };
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  const { mutate: createCoupon, isPending, isError, error } = useMutation({
    mutationKey: ["createCoupon"],
    mutationFn: createCouponApi,
    onSuccess: invalidate(queryClient),
  });

  return { createCoupon, isPending, isError, error };
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  const { mutate: updateCoupon, isPending, isError, error } = useMutation({
    mutationKey: ["updateCoupon"],
    mutationFn: updateCouponApi,
    onSuccess: invalidate(queryClient),
  });

  return { updateCoupon, isPending, isError, error };
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteCoupon, isPending, isError, error } = useMutation({
    mutationKey: ["deleteCoupon"],
    mutationFn: deleteCouponApi,
    onSuccess: invalidate(queryClient),
  });

  return { deleteCoupon, isPending, isError, error };
};
