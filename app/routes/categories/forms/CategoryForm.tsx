import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const CategoryForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Card title="Category Information" variant="borderless">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Burgers" />
          </Form.Item>
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Price Configuration" variant="borderless">
          <Form.List name="prizeConfiguration">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    size="small"
                    style={{ marginBottom: 12 }}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                        aria-label="Remove price configuration"
                      />
                    }
                  >
                    <Form.Item
                      {...field}
                      key={`${field.key}-key`}
                      name={[field.name, "key"]}
                      label="Field name"
                      rules={[
                        { required: true, message: "A field name is required" },
                      ]}
                    >
                      <Input placeholder="size" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      key={`${field.key}-priceType`}
                      name={[field.name, "priceType"]}
                      label="Price type"
                      rules={[{ required: true, message: "Price type is required" }]}
                    >
                      <Select
                        options={[
                          { label: "Base", value: "base" },
                          { label: "Additional", value: "additional" },
                        ]}
                        placeholder="Base or additional"
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      key={`${field.key}-options`}
                      name={[field.name, "options"]}
                      label="Options"
                      rules={[
                        { required: true, message: "At least one option is required" },
                      ]}
                    >
                      <Select
                        mode="tags"
                        placeholder="Small, Medium, Large"
                        open={false}
                        suffixIcon={null}
                      />
                    </Form.Item>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({ key: "", priceType: "additional", options: [] })
                  }
                >
                  Add price field
                </Button>
              </>
            )}
          </Form.List>
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Attributes" variant="borderless">
          <Form.List name="attributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    size="small"
                    style={{ marginBottom: 12 }}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                        aria-label="Remove attribute"
                      />
                    }
                  >
                    <Form.Item
                      {...field}
                      key={`${field.key}-name`}
                      name={[field.name, "name"]}
                      label="Name"
                      rules={[{ required: true, message: "Name is required" }]}
                    >
                      <Input placeholder="spicy" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      key={`${field.key}-widgetType`}
                      name={[field.name, "widgetType"]}
                      label="Widget"
                      rules={[{ required: true, message: "Widget type is required" }]}
                    >
                      <Select
                        options={[
                          { label: "Switch (true/false)", value: "switch" },
                          { label: "Radio (one of the options)", value: "radio" },
                        ]}
                        placeholder="Switch or radio"
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      key={`${field.key}-defaultValue`}
                      name={[field.name, "defaultValue"]}
                      label="Default value"
                      rules={[
                        { required: true, message: "A default value is required" },
                      ]}
                    >
                      <Input placeholder="false" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      key={`${field.key}-options`}
                      name={[field.name, "options"]}
                      label="Options"
                      extra="Only used when the widget is a radio"
                    >
                      <Select
                        mode="tags"
                        placeholder="mild, hot"
                        open={false}
                        suffixIcon={null}
                      />
                    </Form.Item>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      name: "",
                      widgetType: "switch",
                      defaultValue: "false",
                      options: [],
                    })
                  }
                >
                  Add attribute
                </Button>
              </>
            )}
          </Form.List>
        </Card>
      </Col>
    </Row>
  );
};

export default CategoryForm;
