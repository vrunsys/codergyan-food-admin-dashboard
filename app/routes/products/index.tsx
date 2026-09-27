import { Avatar, Space, Table, Tag, Typography } from "antd";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import { useProducts, type Product, type ProductQueryParams } from "~/api/products";
import { PER_PAGE, CURRENT_PAGE } from "~/constants";
import type { AuthState } from "~/store/userSlice";
import ProductFilter from "./ProductFilter";
import NewProductDrawer from "./NewProductDrawer";

const Products = () => {
  const { user } = useSelector((state: { user: AuthState }) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: CURRENT_PAGE,
    limit: PER_PAGE,
    q: undefined,
    categoryId: undefined,
    isPublish: undefined,
    tenantId: undefined,
  });

  const { productsData, isLoading, error } = useProducts(queryParams);

  const debouncedOnFilterChange = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({ ...prev, page: 1, q: value || undefined }));
      }, 500),
    []
  );

  const onFilterChange = (
    filterName: string,
    filterValue: string | boolean | undefined
  ) => {
    if (filterName === "q") {
      debouncedOnFilterChange(filterValue as string);
      return;
    }
    setQueryParams((prev) => ({ ...prev, page: 1, [filterName]: filterValue }));
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Product) => (
        <Space>
          <Avatar
            src={record.image}
            shape="square"
            size={48}
            style={{ flexShrink: 0, backgroundColor: "#f5f5f5" }}
          />
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{record.name}</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublish",
      key: "isPublish",
      render: (isPublish: boolean) =>
        isPublish ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="orange">Draft</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: Product) => (
        <Space>
          <Typography.Link onClick={() => console.log("edit", record._id)}>
            Edit
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%", marginTop: 14 }}>
      {error && <p>{error.message}</p>}
      <ProductFilter
        queryParams={queryParams}
        onFilterChange={onFilterChange}
        onClick={() => setDrawerOpen(true)}
        isAdmin={isAdmin}
      />
      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={productsData?.data ?? []}
        columns={columns}
        pagination={{
          total: productsData?.total ?? 0,
          current: queryParams.page,
          pageSize: queryParams.limit,
          onChange: (page, pageSize) => {
            setQueryParams((prev) => ({ ...prev, page, limit: pageSize }));
          },
          showTotal: (total, range) =>
            `Showing ${range[0]} - ${range[1]} of ${total} products`,
        }}
      />
      <NewProductDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAdmin={isAdmin}
        tenantId={user?.tenants?.id?.toString()}
      />
    </Space>
  );
};

export default Products;
