import { useQuery } from "@tanstack/react-query";

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

export const useProducts = (queryParams: ProductQueryParams) => {
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  });

  return { productsData, isLoading, error };
};
