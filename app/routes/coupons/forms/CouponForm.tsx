import { Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { useAllTenants } from "~/api/tenants";

type CouponFormProps = {
  isAdmin: boolean;
};

const CouponForm = ({ isAdmin }: CouponFormProps) => {
  const { tenantsOptions } = useAllTenants();

  return (
    <Row>
      <Col span={24}>
        <Card title="Coupon Information" variant="borderless">
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Title is required" },
              { max: 120, message: "Title must be 120 characters or fewer" },
            ]}
          >
            <Input placeholder="Ten percent off" />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            normalize={(value: string) => value?.toUpperCase()}
            rules={[
              { required: true, message: "Code is required" },
              {
                pattern: /^[A-Za-z0-9_-]+$/,
                message: "Only letters, numbers, _ and - are allowed",
              },
              { min: 3, max: 32, message: "Code must be 3 to 32 characters" },
            ]}
          >
            <Input placeholder="ENJOY_10" />
          </Form.Item>

          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[
              { required: true, message: "Discount is required" },
              {
                type: "number",
                min: 0.01,
                max: 100,
                message: "Discount must be between 1 and 100",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Valid up to"
            name="validUpto"
            rules={[
              { required: true, message: "A valid-until date is required" },
            ]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              placeholder="Pick a date"
            />
          </Form.Item>

          {isAdmin ? (
            <Form.Item
              label="Restaurant"
              name="tenantId"
              tooltip="Leave blank to use your own restaurant"
            >
              <Select
                allowClear
                placeholder="Your restaurant"
                options={tenantsOptions.map((tenant) => ({
                  label: tenant.name,
                  value: tenant.id,
                }))}
              />
            </Form.Item>
          ) : null}
        </Card>
      </Col>
    </Row>
  );
};

export default CouponForm;
