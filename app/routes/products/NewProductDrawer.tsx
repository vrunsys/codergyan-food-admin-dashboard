import { Button, Drawer, Form, Space, theme } from "antd";
import { useCreateProduct, type NewProduct } from "~/api/products";
import ProductForm from "./forms/ProductForm";

type NewProductDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  tenantId?: string;
};

function NewProductDrawer({ isOpen, onClose, isAdmin, tenantId }: NewProductDrawerProps) {
  const [form] = Form.useForm();
  const { createProduct, isPending } = useCreateProduct();
  const { token: { colorBgLayout } } = theme.useToken();

  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const attributes = [
      { name: "isVeg", value: values.attributes?.isVeg ?? false },
      { name: "spicyLevel", value: values.attributes?.spicyLevel ?? "Low" },
    ];

    const priceConfiguration = {
      size: {
        priceType: "base" as const,
        availableOptions: values.priceConfiguration?.size?.availableOptions ?? {},
      },
      crust: {
        priceType: "additional" as const,
        availableOptions: values.priceConfiguration?.crust?.availableOptions ?? {},
      },
    };

    const product: NewProduct = {
      name: values.name,
      description: values.description,
      categoryId: values.categoryId,
      tenantId: isAdmin ? values.tenantId : (tenantId ?? ""),
      isPublish: values.isPublish ?? false,
      priceConfiguration,
      attributes,
      image: values.image,
    };

    createProduct(product, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => {
        form.resetFields();
        onClose();
      }}
      width={720}
      title="Add Product"
      styles={{ body: { background: colorBgLayout } }}
      extra={
        <Space>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={onHandleSubmit} loading={isPending}>
            Save Product
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <ProductForm isAdmin={isAdmin} />
      </Form>
    </Drawer>
  );
}

export default NewProductDrawer;
