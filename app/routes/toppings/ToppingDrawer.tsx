import { useEffect } from "react";
import { Alert, Button, Drawer, Form, Space } from "antd";
import {
  type Topping,
  type ToppingPayload,
  useCreateTopping,
  useUpdateTopping,
} from "~/api/toppings";
import ToppingForm from "./forms/ToppingForm";

type ToppingDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  ownTenantId?: string;
  editingTopping?: Topping | null;
};

type FormValues = {
  name: string;
  price: number;
  isPublish: boolean;
  tenantId?: string;
  image?: File;
};

const ToppingDrawer = ({
  isOpen,
  onClose,
  isAdmin,
  ownTenantId,
  editingTopping,
}: ToppingDrawerProps) => {
  const [form] = Form.useForm();
  const { createTopping, isPending: isCreating, error: createError } =
    useCreateTopping();
  const { updateTopping, isPending: isUpdating, error: updateError } =
    useUpdateTopping();

  const isEditing = Boolean(editingTopping);
  const isPending = isCreating || isUpdating;
  const apiError = isEditing ? updateError : createError;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!editingTopping) {
      form.resetFields();
      // a manager is pinned to their own restaurant by the catalog
      form.setFieldsValue({ isPublish: true, tenantId: ownTenantId });
      return;
    }

    form.setFieldsValue({
      name: editingTopping.name,
      price: editingTopping.price,
      isPublish: editingTopping.isPublish,
      tenantId: editingTopping.tenantId,
    });
  }, [isOpen, editingTopping, ownTenantId, form]);

  const onHandleSubmit = async () => {
    const values: FormValues = await form.validateFields();

    const payload: ToppingPayload = {
      name: values.name,
      price: values.price,
      isPublish: values.isPublish,
      tenantId: values.tenantId ?? ownTenantId ?? "",
      ...(values.image ? { image: values.image } : {}),
    };

    if (isEditing && editingTopping) {
      updateTopping({ _id: editingTopping._id, ...payload });
    } else {
      createTopping(payload);
    }
  };

  const onHandleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onHandleClose}
      size={600}
      title={isEditing ? "Edit topping" : "New topping"}
      extra={
        <Space>
          <Button onClick={onHandleClose} disabled={isPending}>
            Close
          </Button>
          <Button
            type="primary"
            onClick={onHandleSubmit}
            loading={isPending}
            disabled={isPending}
          >
            Submit
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      {apiError ? (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message={apiError.message}
        />
      ) : null}

      <Form form={form} layout="vertical">
        <ToppingForm isAdmin={isAdmin} editingTopping={editingTopping} />
      </Form>
    </Drawer>
  );
};

export default ToppingDrawer;
