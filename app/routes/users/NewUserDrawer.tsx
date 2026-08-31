import { Button, Drawer, Space } from "antd";

type NewUserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewUserDrawer({isOpen, onClose}: NewUserDrawerProps) {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      size={600}
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
      
    </Drawer>
  );
}

export default NewUserDrawer;