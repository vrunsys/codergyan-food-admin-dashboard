import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { App, Avatar, Button, Input, Popconfirm, Select, Space, Table, Tag, Typography } from "antd";
import { debounce } from "lodash";
import {
  type Topping,
  type ToppingQueryParams,
  useDeleteTopping,
  useToppings,
} from "~/api/toppings";
import { useAllTenants } from "~/api/tenants";
import { CURRENT_PAGE, PER_PAGE } from "~/constants";
import type { AuthState } from "~/store/userSlice";
import ToppingDrawer from "./ToppingDrawer";

const Toppings = () => {
  const { user } = useSelector((state: { user: AuthState }) => state.user);
  const { message } = App.useApp();
  const isAdmin = user?.role === "ADMIN";
  const { tenantsOptions } = useAllTenants();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [search, setSearch] = useState("");

  const [queryParams, setQueryParams] = useState<ToppingQueryParams>({
    page: CURRENT_PAGE,
    limit: PER_PAGE,
    q: undefined,
    tenantId: undefined,
    isPublish: undefined,
  });

  const { toppingsData, isLoading, error } = useToppings(queryParams);
  const { deleteTopping, isPending: isDeleting } = useDeleteTopping();

  const openCreateDrawer = () => {
    setEditingTopping(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (topping: Topping) => {
    setEditingTopping(topping);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingTopping(null);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({ ...prev, page: 1, q: value || undefined }));
      }, 500),
    []
  );

  const tenantName = (tenantId: string) =>
    tenantsOptions.find((tenant) => String(tenant.id) === String(tenantId))
      ?.name ?? tenantId;

  const columns = [
    {
      title: "Topping",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Topping) => (
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
              {record.price}
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
    ...(isAdmin
      ? [
          {
            title: "Restaurant",
            dataIndex: "tenantId",
            key: "tenantId",
            render: (tenantId: string) => tenantName(tenantId),
          },
        ]
      : []),
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Topping) => (
        <Space>
          <Typography.Link onClick={() => openEditDrawer(record)}>
            Edit
          </Typography.Link>
          <Popconfirm
            title="Delete this topping?"
            description={`${record.name} will be removed from the menu.`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() =>
              deleteTopping(record._id, {
                onSuccess: () => message.success("Topping deleted"),
                onError: (cause) =>
                  message.error(cause.message ?? "Failed to delete topping"),
              })
            }
          >
            <Typography.Link type="danger" disabled={isDeleting}>
              Delete
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%", marginTop: 14 }}>
      {error ? <p>{error.message}</p> : null}

      <Space wrap>
        <Button type="primary" onClick={openCreateDrawer}>
          New topping
        </Button>

        <Input.Search
          allowClear
          placeholder="Search toppings"
          style={{ width: 220 }}
          onChange={(event) => {
            setSearch(event.target.value);
            debouncedSearch(event.target.value);
          }}
          value={search}
        />

        {isAdmin ? (
          <Select
            allowClear
            placeholder="All restaurants"
            style={{ width: 200 }}
            options={tenantsOptions.map((tenant) => ({
              label: tenant.name,
              value: String(tenant.id),
            }))}
            onChange={(value) =>
              setQueryParams((prev) => ({
                ...prev,
                page: 1,
                tenantId: value ?? undefined,
              }))
            }
          />
        ) : null}

        <Select
          allowClear
          placeholder="Any status"
          style={{ width: 140 }}
          options={[
            { label: "Published", value: true },
            { label: "Draft", value: false },
          ]}
          onChange={(value) =>
            setQueryParams((prev) => ({
              ...prev,
              page: 1,
              isPublish: value ?? undefined,
            }))
          }
        />
      </Space>

      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={toppingsData?.data ?? []}
        columns={columns}
        pagination={{
          total: toppingsData?.total ?? 0,
          current: queryParams.page,
          pageSize: queryParams.limit,
          onChange: (page, pageSize) =>
            setQueryParams((prev) => ({ ...prev, page, limit: pageSize })),
          showTotal: (total, range) =>
            `Showing ${range[0]} - ${range[1]} of ${total} toppings`,
        }}
      />

      <ToppingDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        isAdmin={isAdmin}
        ownTenantId={user?.tenants?.id?.toString()}
        editingTopping={editingTopping}
      />
    </Space>
  );
};

export default Toppings;
