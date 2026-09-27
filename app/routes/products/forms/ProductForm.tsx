import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Upload,
  Space,
  InputNumber,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCategories, type Category } from "~/api/categories";
import { useAllTenants } from "~/api/tenants";

const { TextArea } = Input;

type ProductFormProps = {
  isAdmin: boolean;
};

const ProductForm = ({ isAdmin }: ProductFormProps) => {
  const { categoriesData, isLoading: categoriesLoading } = useCategories();
  const { tenantsOptions, isLoading: tenantsLoading } = useAllTenants();

  return (
    <Row gutter={[16, 16]}>
      {/* Basic Info */}
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
                  options={categoriesData.map((cat: Category) => ({
                    value: cat._id,
                    label: cat.name,
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
                    options={tenantsOptions.map((t) => ({
                      value: t.id,
                      label: t.name,
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

      {/* Product Image */}
      <Col span={24}>
        <Card title="Product Image" variant="borderless">
          <Form.Item
            name="image"
            valuePropName="file"
            getValueFromEvent={(e) => e?.file}
            rules={[{ required: true, message: "Product image is required" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Space direction="vertical" size={4} style={{ alignItems: "center" }}>
                <PlusOutlined />
                <Typography.Text style={{ fontSize: 12 }}>Upload</Typography.Text>
              </Space>
            </Upload>
          </Form.Item>
        </Card>
      </Col>

      {/* Price Configuration */}
      <Col span={24}>
        <Card title="Price Configuration" variant="borderless">
          <Typography.Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Configure size-based pricing and crust options.
          </Typography.Text>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Typography.Text strong>Size (Base Price)</Typography.Text>
            </Col>
            {["Small", "Medium", "Large"].map((size) => (
              <Col span={8} key={size}>
                <Form.Item
                  label={size}
                  name={["priceConfiguration", "size", "availableOptions", size]}
                  rules={[{ required: true, message: `${size} price is required` }]}
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
            <Col span={24} style={{ marginTop: 8 }}>
              <Typography.Text strong>Crust (Additional Price)</Typography.Text>
            </Col>
            {[
              { label: "Thin", defaultVal: 0 },
              { label: "Thick", defaultVal: 50 },
              { label: "Stuffed", defaultVal: 80 },
            ].map(({ label }) => (
              <Col span={8} key={label}>
                <Form.Item
                  label={label}
                  name={["priceConfiguration", "crust", "availableOptions", label]}
                  rules={[{ required: true, message: `${label} price is required` }]}
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
        </Card>
      </Col>

      {/* Attributes */}
      <Col span={24}>
        <Card title="Attributes" variant="borderless">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Veg / Non-Veg" name={["attributes", "isVeg"]}>
                <Select
                  placeholder="Select"
                  options={[
                    { value: true, label: "Veg" },
                    { value: false, label: "Non-Veg" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Spicy Level" name={["attributes", "spicyLevel"]}>
                <Select
                  placeholder="Select spicy level"
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductForm;
