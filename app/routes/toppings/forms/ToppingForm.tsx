import { Card, Col, Form, Image, Input, InputNumber, Row, Select, Space, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { Topping } from "~/api/toppings";
import { useAllTenants } from "~/api/tenants";

type ToppingFormProps = {
  isAdmin: boolean;
  editingTopping?: Topping | null;
};

const ToppingForm = ({ isAdmin, editingTopping }: ToppingFormProps) => {
  const { tenantsOptions } = useAllTenants();

  return (
    <Row>
      <Col span={24}>
        <Card title="Topping Information" variant="borderless">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              { max: 120, message: "Name must be 120 characters or fewer" },
            ]}
          >
            <Input placeholder="Extra cheese" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Price is required" },
              {
                type: "number",
                min: 0,
                message: "Price cannot be negative",
              },
            ]}
          >
            <InputNumber min={0} precision={2} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="isPublish"
            valuePropName="checked"
            rules={[{ required: true, message: "Choose a status" }]}
          >
            <Select
              options={[
                { label: "Published", value: true },
                { label: "Draft", value: false },
              ]}
              placeholder="Published or draft"
            />
          </Form.Item>

          {isAdmin ? (
            <Form.Item
              label="Restaurant"
              name="tenantId"
              rules={[{ required: true, message: "Restaurant is required" }]}
            >
              <Select
                placeholder="Select a restaurant"
                options={tenantsOptions.map((tenant) => ({
                  label: tenant.name,
                  value: tenant.id,
                }))}
              />
            </Form.Item>
          ) : null}
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Topping Image" variant="borderless">
          <Space align="start" size={16}>
            {editingTopping?.image ? (
              <Image
                src={editingTopping.image}
                alt={editingTopping.name}
                width={104}
                height={104}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ) : null}

            <Form.Item
              name="image"
              valuePropName="file"
              getValueFromEvent={(event) => event?.file}
              rules={
                editingTopping
                  ? []
                  : [{ required: true, message: "An image is required" }]
              }
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
                  <span style={{ fontSize: 12 }}>
                    {editingTopping ? "Replace" : "Upload"}
                  </span>
                </Space>
              </Upload>
            </Form.Item>
          </Space>
          <div style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c" }}>
            Image is required when creating. Up to 5MB.
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ToppingForm;
