import { Button, Drawer, Form, Space, theme } from "antd";
import UserForm from "./forms/UserForm";

type NewUserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewUserDrawer({ isOpen, onClose }: NewUserDrawerProps) {
  const { token: { colorBgLayout } } = theme.useToken()
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
          <Button onClick={onClose}>
            Close
          </Button>
          <Button type="primary">
            Submit
          </Button>
        </Space>
      }
      destroyOnHidden>
      <Form layout="vertical">
        <UserForm />
      </Form>
    </Drawer>
  );
}

export default NewUserDrawer;