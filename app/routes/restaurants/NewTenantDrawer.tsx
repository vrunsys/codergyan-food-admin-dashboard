import { Button, Drawer, Space } from "antd";

type NewTenantProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewTenantDrawer({isOpen, onClose}: NewTenantProps) {
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

export default NewTenantDrawer;