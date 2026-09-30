import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CATALOG_API_URL = import.meta.env.VITE_AUTH_API;
const CATALOG_SERVICE = "api/catalog";

export interface Topping {
  _id: string;
  name: string;
  price: number;
  image: string;
  tenantId: string;
  isPublish: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ToppingPayload {
  name: string;
  price: number;
  tenantId: string;
  isPublish: boolean;
  image?: File;
}

export interface ToppingQueryParams {
  page: number;
  limit: number;
  q?: string;
  tenantId?: string;
  isPublish?: boolean;
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

const getToppings = async (queryParams: ToppingQueryParams) => {
  const params = new URLSearchParams({
    page: queryParams.page.toString(),
    limit: queryParams.limit.toString(),
    ...(queryParams.q && { q: queryParams.q }),
    ...(queryParams.tenantId && { tenantId: queryParams.tenantId }),
    ...(queryParams.isPublish !== undefined && {
      isPublish: queryParams.isPublish.toString(),
    }),
  });

  const response = await fetch(
    `${CATALOG_API_URL}/${CATALOG_SERVICE}/toppings?${params}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch toppings"));
  }

  return response.json();
};

// The catalog parses price and isPublish itself, so everything is sent as a
// string via FormData.
const toFormData = (topping: ToppingPayload) => {
  const formData = new FormData();
  formData.append("name", topping.name);
  formData.append("price", String(topping.price));
  formData.append("tenantId", topping.tenantId);
  formData.append("isPublish", String(topping.isPublish));
  if (topping.image) {
    formData.append("image", topping.image);
  }
  return formData;
};

const createToppingApi = async (topping: ToppingPayload) => {
  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/toppings`, {
    method: "POST",
    credentials: "include",
    body: toFormData(topping),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to create topping"));
  }

  return response.json();
};

const updateToppingApi = async ({
  _id,
  ...topping
}: ToppingPayload & { _id: string }) => {
  const response = await fetch(
    `${CATALOG_API_URL}/${CATALOG_SERVICE}/toppings/${_id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: toFormData(topping),
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update topping"));
  }

  return response.json();
};

const deleteToppingApi = async (_id: string) => {
  const response = await fetch(
    `${CATALOG_API_URL}/${CATALOG_SERVICE}/toppings/${_id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to delete topping"));
  }

  return response.json();
};

export const useToppings = (queryParams: ToppingQueryParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["toppings", queryParams],
    queryFn: () => getToppings(queryParams),
  });

  return { toppingsData: data, isLoading, error };
};

export const useCreateTopping = () => {
  const queryClient = useQueryClient();

  const { mutate: createTopping, isPending, isError, error } = useMutation({
    mutationKey: ["createTopping"],
    mutationFn: createToppingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toppings"] });
    },
  });

  return { createTopping, isPending, isError, error };
};

export const useUpdateTopping = () => {
  const queryClient = useQueryClient();

  const { mutate: updateTopping, isPending, isError, error } = useMutation({
    mutationKey: ["updateTopping"],
    mutationFn: updateToppingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toppings"] });
    },
  });

  return { updateTopping, isPending, isError, error };
};

export const useDeleteTopping = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteTopping, isPending, isError, error } = useMutation({
    mutationKey: ["deleteTopping"],
    mutationFn: deleteToppingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toppings"] });
    },
  });

  return { deleteTopping, isPending, isError, error };
};
