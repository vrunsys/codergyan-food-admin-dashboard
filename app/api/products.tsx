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
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttribute[];
  createdAt?: string;
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

type ProductPayload = Omit<NewProduct, "image"> & {
  image?: File;
};

export interface UpdateProduct extends ProductPayload {
  _id: string;
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

const getProductFormData = (product: ProductPayload) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("categoryId", product.categoryId);
  formData.append("tenantId", product.tenantId);
  formData.append("isPublish", String(product.isPublish));
  formData.append("priceConfiguration", JSON.stringify(product.priceConfiguration));
  formData.append("attributes", JSON.stringify(product.attributes));
  if (product.image) {
    formData.append("image", product.image);
  }

  return formData;
};

const createProductApi = async (product: NewProduct) => {
  const formData = getProductFormData(product);

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

const updateProductApi = async ({ _id, ...product }: UpdateProduct) => {
  const response = await fetch(`${CATALOG_API_URL}/${CATALOG_SERVICE}/products/${_id}`, {
    method: "PATCH",
    credentials: "include",
    body: getProductFormData(product),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending, isError } = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { updateProduct, isPending, isError };
};

export const useProducts = (queryParams: ProductQueryParams) => {
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  });

  return { productsData, isLoading, error };
};
