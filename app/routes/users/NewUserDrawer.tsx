import { Button, Drawer, Form, Space, theme, type FormInstance } from "antd";
import UserForm from "./forms/UserForm";
import { useCreateUser, type NewUser, useUpdateUser, type User } from "~/api/users";

type NewUserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  form: FormInstance<any>;
  isEditing: boolean;
};

function NewUserDrawer({ isOpen, onClose, form, isEditing }: NewUserDrawerProps) {
  const { createUser, isError } = useCreateUser()
  const { updateUser, isError: isUpdateError } = useUpdateUser()
  const { token: { colorBgLayout } } = theme.useToken()
  const onHandleSubmit = async () => {
    await form.validateFields();
    const user = form.getFieldsValue();
    if (isEditing || isUpdateError) {
      updateUser(user as User);
    } else {
      createUser(user as NewUser);
    }
   
    if (!isError || !isUpdateError) {
      form.resetFields();
      onClose();
    }
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
      title={isEditing ? "Edit User" : "New User"}
      extra={
        <Space>
          <Button onClick={onClose} >
            Close
          </Button>
          <Button type="primary" onClick={onHandleSubmit}>
            Submit
          </Button>
        </Space>
      }
      destroyOnHidden>
      <Form layout="vertical" form={form}>
        <UserForm isEditing={isEditing} />
      </Form>
    </Drawer>
  );
}

export default NewUserDrawer;