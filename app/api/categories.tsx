import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CATALOG_API_URL = import.meta.env.VITE_AUTH_API;
const CATALOG_SERVICE = "api/catalog";

export interface Category {
  _id: string;
  name: string;
  prizeConfiguration?: Record<string, CategoryPriceConfiguration>;
  priceConfiguration?: Record<string, CategoryPriceConfiguration>;
  attributes?: CategoryAttribute[];
}

export interface CategoryPriceConfiguration {
  priceType: "base" | "additional";
  options: string[];
  _id?: string;
}

export interface CategoryAttribute {
  name: string;
  widgetType: "radio" | "switch" | "select";
  defaultValue: string | boolean;
  options: string[];
  _id?: string;
}

export interface CategoryPriceConfig {
  priceType: "base" | "additional";
  options: string[];
}

export interface CategoryAttributeInput {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  options?: string[];
}

/**
 * The catalog validator requires all three fields, so a name-only payload is
 * rejected on create.
 */
export interface CategoryPayload {
  name: string;
  prizeConfiguration: Record<string, CategoryPriceConfig>;
  attributes: CategoryAttributeInput[];
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

const getCategories = async () => {
  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch categories"));
  }

  return response.json();
};

const createCategory = async (category: CategoryPayload) => {
  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to create category"));
  }

  return response.json();
};

const updateCategory = async ({ _id, ...data }: CategoryPayload & { _id: string }) => {
  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/categories/${_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update category"));
  }

  return response.json();
};

const deleteCategory = async (_id: string) => {
  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/categories/${_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to delete category"));
  }

  return response.json();
};

export const useCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Normalise: API may return { data: [...] }, { categories: [...] }, or a bare array
  const categoriesData: Category[] = Array.isArray(data)
    ? data
    : (data?.data ?? data?.categories ?? []);

  return { categoriesData, isLoading, error };
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: createCategoryMutate, isPending, isError, error } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { createCategoryMutate, isPending, isError, error };
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: updateCategoryMutate, isPending, isError, error } = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { updateCategoryMutate, isPending, isError, error };
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteCategoryMutate, isPending, isError, error } = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { deleteCategoryMutate, isPending, isError, error };
};
