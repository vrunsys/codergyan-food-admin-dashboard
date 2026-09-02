import { Button, Drawer, Form, Space, theme } from "antd";
import UserForm from "./forms/UserForm";
import { useCreateUser, type NewUser } from "~/api/users";

type NewUserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewUserDrawer({ isOpen, onClose }: NewUserDrawerProps) {
  const { createUser, isSuccess } = useCreateUser()
  const [form] = Form.useForm();
  const { token: { colorBgLayout } } = theme.useToken()
  const onHandleSubmit = async () => {
    await form.validateFields();
    const user = form.getFieldsValue() as NewUser;
    createUser(user);
    if (isSuccess) {
      form.resetFields();
      onClose();
    }
  }

  const onFormClose = () => {
    form.resetFields();
    onClose();
  }
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      size={600}
      styles={{
        body: {
          background: colorBgLayout,
        }
      }}
      extra={
        <Space>
          <Button onClick={onFormClose} >
            Close
          </Button>
          <Button type="primary" onClick={onHandleSubmit}>
            Submit
          </Button>
        </Space>
      }
      destroyOnHidden>
      <Form layout="vertical" form={form}>
        <UserForm />
      </Form>
    </Drawer>
  );
}

export default NewUserDrawer;