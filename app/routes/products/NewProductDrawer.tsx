import { Button, Drawer, Form, Space, theme } from "antd";
import { useEffect } from "react";
import {
  useCreateProduct,
  useUpdateProduct,
  type NewProduct,
  type Product,
} from "~/api/products";
import ProductForm from "./forms/ProductForm";

type NewProductDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  tenantId?: string;
  editingProduct: Product | null;
};

function NewProductDrawer({
  isOpen,
  onClose,
  isAdmin,
  tenantId,
  editingProduct,
}: NewProductDrawerProps) {
  const [form] = Form.useForm();
  const { createProduct, isPending } = useCreateProduct();
  const { updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { token: { colorBgLayout } } = theme.useToken();

  useEffect(() => {
    if (!isOpen) return;

    form.resetFields();
    if (editingProduct) {
      form.setFieldsValue({
        ...editingProduct,
        attributes: Object.fromEntries(
          (editingProduct.attributes ?? []).map(({ name, value }) => [name, value])
        ),
        image: undefined,
      });
    }
  }, [editingProduct, form, isOpen]);

  const closeDrawer = () => {
    form.resetFields();
    onClose();
  };

  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const attributes = Object.entries(values.attributes ?? {}).map(([name, value]) => ({
      name,
      value: value as string | boolean,
    }));

    const priceConfiguration = values.priceConfiguration ?? {};

    const product = {
      name: values.name,
      description: values.description,
      categoryId: values.categoryId,
      tenantId: isAdmin ? values.tenantId : (tenantId ?? ""),
      isPublish: values.isPublish ?? false,
      priceConfiguration,
      attributes,
      image: values.image,
    };

    const onSuccess = () => closeDrawer();

    if (editingProduct) {
      updateProduct({ ...product, _id: editingProduct._id }, { onSuccess });
      return;
    }

    createProduct(product as NewProduct, { onSuccess });
  };

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      width={720}
      title={editingProduct ? "Edit Product" : "Add Product"}
      styles={{ body: { background: colorBgLayout } }}
      extra={
        <Space>
          <Button
            onClick={closeDrawer}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={onHandleSubmit} loading={isPending || isUpdating}>
            {editingProduct ? "Update Product" : "Save Product"}
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <ProductForm isAdmin={isAdmin} isEditing={Boolean(editingProduct)} />
      </Form>
    </Drawer>
  );
}

export default NewProductDrawer;
