import { useEffect } from "react";
import { Alert, Button, Drawer, Form, Space } from "antd";
import {
  type Category,
  type CategoryPayload,
  useCreateCategory,
  useUpdateCategory,
} from "~/api/categories";
import CategoryForm from "./forms/CategoryForm";

type CategoryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  editingCategory?: Category | null;
};

type FormValues = {
  name: string;
  prizeConfiguration?: Array<{
    key: string;
    priceType: "base" | "additional";
    options: string[];
  }>;
  attributes?: Array<{
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    options?: string[];
  }>;
};

const CategoryDrawer = ({
  isOpen,
  onClose,
  editingCategory,
}: CategoryDrawerProps) => {
  const [form] = Form.useForm();
  const {
    createCategoryMutate,
    isPending: isCreating,
    error: createError,
  } = useCreateCategory();
  const {
    updateCategoryMutate,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateCategory();

  const isEditing = Boolean(editingCategory);
  const isPending = isCreating || isUpdating;
  const apiError = isEditing ? updateError : createError;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!editingCategory) {
      form.resetFields();
      return;
    }

    const configuration =
      editingCategory.prizeConfiguration ?? editingCategory.priceConfiguration;

    form.setFieldsValue({
      name: editingCategory.name,
      prizeConfiguration: Object.entries(configuration ?? {}).map(
        ([key, value]) => ({
          key,
          priceType: value.priceType,
          options: Array.isArray(value.options) ? value.options : [],
        }),
      ),
      attributes: (editingCategory.attributes ?? []).map((attribute) => ({
        name: attribute.name,
        widgetType: attribute.widgetType,
        defaultValue: String(attribute.defaultValue),
        options: attribute.options,
      })),
    });
  }, [isOpen, editingCategory, form]);

  const onHandleSubmit = async () => {
    const values: FormValues = await form.validateFields();

    // the API expects prizeConfiguration as a map keyed by field name
    const prizeConfiguration = (values.prizeConfiguration ?? []).reduce(
      (accumulator, entry) => {
        accumulator[entry.key] = {
          priceType: entry.priceType,
          options: entry.options,
        };
        return accumulator;
      },
      {} as Record<string, { priceType: "base" | "additional"; options: string[] }>,
    );

    const payload: CategoryPayload = {
      name: values.name,
      prizeConfiguration,
      attributes: (values.attributes ?? []).map((attribute) => ({
        name: attribute.name,
        widgetType: attribute.widgetType,
        defaultValue: attribute.defaultValue,
        ...(attribute.options?.length
          ? { options: attribute.options }
          : {}),
      })),
    };

    if (isEditing && editingCategory) {
      updateCategoryMutate({ _id: editingCategory._id, ...payload });
    } else {
      createCategoryMutate(payload);
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
      size={720}
      title={isEditing ? "Edit category" : "New category"}
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
        <CategoryForm />
      </Form>
    </Drawer>
  );
};

export default CategoryDrawer;
