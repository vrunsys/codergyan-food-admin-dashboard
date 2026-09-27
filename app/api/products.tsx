import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CATALOG_API_URL = import.meta.env.VITE_AUTH_API;
const CATALOG_SERVICE = "api/catalog";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tenantId: string;
  isPublish: boolean;
  image?: string;
}

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: Record<string, number>;
  };
}

export interface ProductAttribute {
  name: string;
  value: string | boolean;
}

export interface NewProduct {
  name: string;
  description: string;
  categoryId: string;
  tenantId: string;
  isPublish: boolean;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  image: File;
}

export interface ProductQueryParams {
  page: number;
  limit: number;
  q?: string;
  categoryId?: string;
  isPublish?: boolean;
  tenantId?: string;
}

const getProducts = async (queryParams: ProductQueryParams) => {
  const params = new URLSearchParams({
    page: queryParams.page.toString(),
    limit: queryParams.limit.toString(),
    ...(queryParams.q && { q: queryParams.q }),
    ...(queryParams.categoryId && { categoryId: queryParams.categoryId }),
    ...(queryParams.isPublish !== undefined && { isPublish: queryParams.isPublish.toString() }),
    ...(queryParams.tenantId && { tenantId: queryParams.tenantId }),
  });

  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/products?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

const createProductApi = async (product: NewProduct) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("categoryId", product.categoryId);
  formData.append("tenantId", product.tenantId);
  formData.append("isPublish", String(product.isPublish));
  formData.append("priceConfiguration", JSON.stringify(product.priceConfiguration));
  formData.append("attributes", JSON.stringify(product.attributes));
  formData.append("image", product.image);

  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/products`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending, isError } = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { createProduct, isPending, isError };
};

export const useProducts = (queryParams: ProductQueryParams) => {
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  });

  return { productsData, isLoading, error };
};
