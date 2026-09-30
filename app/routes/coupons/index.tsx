import { useState } from "react";
import { useSelector } from "react-redux";
import { App, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { RootState } from "~/store";
import { useAllTenants } from "~/api/tenants";
import { type Coupon, useCoupons, useDeleteCoupon } from "~/api/coupons";
import type { User } from "~/store/userSlice";
import CouponDrawer from "./CouponDrawer";

const isExpired = (coupon: Coupon) =>
  new Date(coupon.validUpto).getTime() < Date.now();

const Coupons = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { message } = App.useApp();
  const isAdmin = user?.role === "ADMIN";
  const { tenantsOptions } = useAllTenants();

  const [tenantFilter, setTenantFilter] = useState<number | undefined>(
    undefined,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const { coupons, isLoading, error } = useCoupons(isAdmin ? tenantFilter : undefined);
  const { deleteCoupon, isPending: isDeleting } = useDeleteCoupon();

  const openCreateDrawer = () => {
    setEditingCoupon(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCoupon(null);
  };

  const tenantName = (tenantId: number) =>
    tenantsOptions.find((tenant) => Number(tenant.id) === tenantId)?.name ??
    `Tenant ${tenantId}`;

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => `${discount}%`,
    },
    {
      title: "Valid up to",
      dataIndex: "validUpto",
      key: "validUpto",
      render: (value: string, record: Coupon) => (
        <Space size={6}>
          <span>
            {new Date(value).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          {isExpired(record) ? <Tag color="red">Expired</Tag> : null}
        </Space>
      ),
    },
    ...(isAdmin
      ? [
          {
            title: "Restaurant",
            dataIndex: "tenantId",
            key: "tenantId",
            render: (tenantId: number) => tenantName(tenantId),
          },
        ]
      : []),
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Typography.Link onClick={() => openEditDrawer(record)}>
            Edit
          </Typography.Link>
          <Popconfirm
            title="Delete this coupon?"
            description={`${record.code} will stop working immediately.`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() =>
              deleteCoupon(record._id, {
                onSuccess: () => message.success("Coupon deleted"),
                onError: (cause) =>
                  message.error(cause.message ?? "Failed to delete coupon"),
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

      <Space>
        <Button type="primary" onClick={openCreateDrawer}>
          New coupon
        </Button>

        {isAdmin ? (
          <Space.Compact>
            <Button
              type={tenantFilter === undefined ? "primary" : "default"}
              onClick={() => setTenantFilter(undefined)}
            >
              All restaurants
            </Button>
            {tenantsOptions.map((tenant) => (
              <Button
                key={tenant.id}
                type={tenantFilter === Number(tenant.id) ? "primary" : "default"}
                onClick={() => setTenantFilter(Number(tenant.id))}
              >
                {tenant.name}
              </Button>
            ))}
          </Space.Compact>
        ) : null}
      </Space>

      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={coupons}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <CouponDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        isAdmin={isAdmin}
        editingCoupon={editingCoupon}
      />
    </Space>
  );
};

export default Coupons;
