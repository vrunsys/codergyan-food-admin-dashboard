import { Button, Drawer, Form, Space } from "antd";
import RestaurantForm from "./forms/RestaurantForm";
import { useNewTenant } from "~/api/tenants";


type NewTenantProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewTenantDrawer({ isOpen, onClose }: NewTenantProps) {
  const { createTenant, isSuccess } = useNewTenant();
  const [form] = Form.useForm();
  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = await form.getFieldsValue();
    createTenant(values);
    if (isSuccess) {
      onClose();
      form.resetFields();
    }
  };
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      size={600}
      extra={
        <Space>
          <Button onClick={() => {
            onClose();
            form.resetFields();
          }}>
            Close
          </Button>
          <Button type="primary" onClick={onHandleSubmit}>
            Submit
          </Button>
        </Space>
      }
      destroyOnHidden>
      <Form form={form}>
        <RestaurantForm  />
      </Form>
    </Drawer>
  );
}

export default NewTenantDrawer;