import { useState } from "react";
import { useSelector } from "react-redux";
import { App, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { RootState } from "~/store";
import {
  type Category,
  useCategories,
  useDeleteCategory,
} from "~/api/categories";
import CategoryDrawer from "./CategoryDrawer";

const Categories = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { message } = App.useApp();
  const isAdmin = user?.role === "ADMIN";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { categoriesData, isLoading, error } = useCategories();
  const { deleteCategoryMutate, isPending: isDeleting } = useDeleteCategory();

  const openCreateDrawer = () => {
    setEditingCategory(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (category: Category) => {
    setEditingCategory(category);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
  };

  const priceFieldCount = (category: Category) =>
    Object.keys(
      category.prizeConfiguration ?? category.priceConfiguration ?? {},
    ).length;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price fields",
      key: "priceFields",
      render: (_: unknown, record: Category) => {
        const count = priceFieldCount(record);
        return count > 0 ? <Tag>{count}</Tag> : <Tag>None</Tag>;
      },
    },
    {
      title: "Attributes",
      key: "attributes",
      render: (_: unknown, record: Category) => {
        const count = record.attributes?.length ?? 0;
        return count > 0 ? <Tag>{count}</Tag> : <Tag>None</Tag>;
      },
    },
    ...(isAdmin
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: unknown, record: Category) => (
              <Space>
                <Typography.Link onClick={() => openEditDrawer(record)}>
                  Edit
                </Typography.Link>
                <Popconfirm
                  title="Delete this category?"
                  description={`${record.name} will no longer be available for products.`}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() =>
                    deleteCategoryMutate(record._id, {
                      onSuccess: () => message.success("Category deleted"),
                      onError: (cause) =>
                        message.error(cause.message ?? "Failed to delete category"),
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
        ]
      : []),
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%", marginTop: 14 }}>
      {error ? <p>{error.message}</p> : null}

      {isAdmin ? (
        <Button type="primary" onClick={openCreateDrawer}>
          New category
        </Button>
      ) : null}

      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={categoriesData}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <CategoryDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        editingCategory={editingCategory}
      />
    </Space>
  );
};

export default Categories;
