import {
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef } from "react";
import {
  useCategories,
  type Category,
  type CategoryAttribute,
} from "~/api/categories";
import type { Product } from "~/api/products";
import { useAllTenants } from "~/api/tenants";

const { TextArea } = Input;

type ProductFormProps = {
  isAdmin: boolean;
  isEditing?: boolean;
  editingProduct?: Product | null;
};

const formatLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getPriceConfiguration = (category?: Category) =>
  category?.prizeConfiguration ?? category?.priceConfiguration ?? {};

const ProductForm = ({
  isAdmin,
  isEditing = false,
  editingProduct,
}: ProductFormProps) => {
  const form = Form.useFormInstance();
  const initializedProductId = useRef<string | null>(null);
  const { categoriesData, isLoading: categoriesLoading } = useCategories();
  const { tenantsOptions, isLoading: tenantsLoading } = useAllTenants();
  const categoryId = Form.useWatch("categoryId", form);
  const selectedCategory = categoriesData.find((category) => category._id === categoryId);
  const priceConfigurations = Object.entries(getPriceConfiguration(selectedCategory));
  const categoryAttributes = selectedCategory?.attributes ?? [];

  useEffect(() => {
    if (!isEditing || !editingProduct) {
      initializedProductId.current = null;
      return;
    }

    if (!selectedCategory || initializedProductId.current === editingProduct._id) {
      return;
    }

    form.setFieldsValue({
      priceConfiguration: editingProduct.priceConfiguration,
      attributes: Object.fromEntries(
        (editingProduct.attributes ?? []).map(({ name, value }) => [name, value])
      ),
    });
    initializedProductId.current = editingProduct._id;
  }, [editingProduct, form, isEditing, selectedCategory]);

  const onCategoryChange = (selectedCategoryId: string) => {
    const category = categoriesData.find(({ _id }) => _id === selectedCategoryId);
    const priceConfiguration = Object.fromEntries(
      Object.entries(getPriceConfiguration(category)).map(([name, configuration]) => [
        name,
        {
          priceType: configuration.priceType,
          availableOptions: {},
        },
      ])
    );
    const attributes = Object.fromEntries(
      (category?.attributes ?? []).map((attribute) => [
        attribute.name,
        attribute.defaultValue,
      ])
    );

    form.setFieldValue("priceConfiguration", priceConfiguration);
    form.setFieldValue("attributes", attributes);
  };

  const renderAttributeInput = (attribute: CategoryAttribute) => {
    if (attribute.widgetType === "switch") {
      const checkedValue = attribute.options[0] ?? true;
      const uncheckedValue = attribute.options[1] ?? false;

      return (
        <Switch
          checkedChildren={String(checkedValue)}
          unCheckedChildren={String(uncheckedValue)}
        />
      );
    }

    if (attribute.widgetType === "radio") {
      return (
        <Radio.Group
          options={attribute.options.map((option) => ({ label: option, value: option }))}
        />
      );
    }

    return (
      <Select
        placeholder={`Select ${formatLabel(attribute.name).toLowerCase()}`}
        options={attribute.options.map((option) => ({ label: option, value: option }))}
      />
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Basic Information" variant="borderless">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Product name is required" }]}
              >
                <Input placeholder="e.g. Margherita Pizza" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select
                  placeholder="Select category"
                  loading={categoriesLoading}
                  onChange={onCategoryChange}
                  options={categoriesData.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="e.g. Classic pizza with fresh tomato sauce and mozzarella cheese"
                />
              </Form.Item>
            </Col>
            {isAdmin && (
              <Col span={12}>
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[{ required: true, message: "Restaurant is required" }]}
                >
                  <Select
                    placeholder="Select restaurant"
                    loading={tenantsLoading}
                    options={tenantsOptions.map((tenant) => ({
                      value: tenant.id,
                      label: tenant.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={isAdmin ? 12 : 24}>
              <Form.Item label="Published" name="isPublish" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Product Image" variant="borderless">
          <Space align="start" size={16}>
            {isEditing && editingProduct?.image && (
              <Image
                src={editingProduct.image}
                alt={editingProduct.name}
                width={104}
                height={104}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            )}
            <Form.Item
              name="image"
              valuePropName="file"
              getValueFromEvent={(event) => event?.file}
              rules={[{ required: !isEditing, message: "Product image is required" }]}
              style={{ marginBottom: 0 }}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
              >
                <Space direction="vertical" size={4} style={{ alignItems: "center" }}>
                  <PlusOutlined />
                  <Typography.Text style={{ fontSize: 12 }}>
                    {isEditing ? "Replace" : "Upload"}
                  </Typography.Text>
                </Space>
              </Upload>
            </Form.Item>
          </Space>
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Price Configuration" variant="borderless">
          <Typography.Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Configure pricing for the selected category.
          </Typography.Text>
          {!selectedCategory && (
            <Typography.Text type="secondary">
              Select a category to display its pricing inputs.
            </Typography.Text>
          )}
          {selectedCategory && priceConfigurations.length === 0 && (
            <Typography.Text type="secondary">
              This category has no price configuration.
            </Typography.Text>
          )}
          {priceConfigurations.map(([configurationName, configuration]) => (
            <Row gutter={[16, 8]} key={configurationName} style={{ marginBottom: 12 }}>
              <Form.Item
                name={["priceConfiguration", configurationName, "priceType"]}
                hidden
              >
                <Input />
              </Form.Item>
              <Col span={24}>
                <Typography.Text strong>
                  {formatLabel(configurationName)} ({formatLabel(configuration.priceType)} Price)
                </Typography.Text>
              </Col>
              {configuration.options.map((option) => (
                <Col
                  xs={24}
                  sm={configuration.options.length <= 2 ? 12 : 8}
                  key={option}
                >
                  <Form.Item
                    label={option}
                    name={[
                      "priceConfiguration",
                      configurationName,
                      "availableOptions",
                      option,
                    ]}
                    rules={[{ required: true, message: `${option} price is required` }]}
                  >
                    <InputNumber
                      prefix="₹"
                      style={{ width: "100%" }}
                      min={0}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          ))}
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Attributes" variant="borderless">
          {!selectedCategory && (
            <Typography.Text type="secondary">
              Select a category to display its attributes.
            </Typography.Text>
          )}
          {selectedCategory && categoryAttributes.length === 0 && (
            <Typography.Text type="secondary">
              This category has no attributes.
            </Typography.Text>
          )}
          <Row gutter={16}>
            {categoryAttributes.map((attribute) => {
              const checkedValue = attribute.options[0] ?? true;
              const uncheckedValue = attribute.options[1] ?? false;

              return (
                <Col xs={24} sm={12} key={attribute._id ?? attribute.name}>
                  <Form.Item
                    label={formatLabel(attribute.name)}
                    name={["attributes", attribute.name]}
                    getValueProps={
                      attribute.widgetType === "switch"
                        ? (value) => ({ checked: value === true || value === checkedValue })
                        : undefined
                    }
                    getValueFromEvent={
                      attribute.widgetType === "switch"
                        ? (checked: boolean) => (checked ? checkedValue : uncheckedValue)
                        : undefined
                    }
                    rules={[
                      {
                        required: true,
                        message: `${formatLabel(attribute.name)} is required`,
                      },
                    ]}
                  >
                    {renderAttributeInput(attribute)}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductForm;
