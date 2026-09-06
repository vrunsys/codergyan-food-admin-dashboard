import {useUsers, type User} from '../../api/users';
import { Space, Table, Button, Form } from 'antd';
import UserFilter from './UserFilter';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import NewUserDrawer from './NewUserDrawer';
import { PER_PAGE, CURRENT_PAGE } from '~/constants';


const Users = () => {
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: CURRENT_PAGE,
    q: undefined,
    role: undefined,
  });
  const { usersData, isLoading, error } = useUsers(queryParams);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => {
    setOpen(false);
    form.resetFields();
    if(editingUser) {
      setEditingUser(null);
    }
  };
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (editingUser) {
      
      form.setFieldsValue({...editingUser, tenantId: editingUser?.tenants?.id});
      openDrawer();
    }
  }, [editingUser, form]);
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Restaurant',
      dataIndex: 'tenant',
      key: 'tenant',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string , record: User) => (
        
        <Space>
          <Button type="link" onClick={() => setEditingUser(record)}>Edit</Button>
        </Space>
      )
    }
  ];

  const debouncedOnFilterChange = useMemo(() => {
    return debounce((value) => {
      setQueryParams((prevParams) => ({ ...prevParams, currentPage: 1, q: value }));
    }, 1000);
  }, [])

  const onFilterChange = (filterName: string, filterValue: string) => {
    if(filterName === 'q') {
      debouncedOnFilterChange(filterValue);
      return;
    } else {
      setQueryParams((prevParams) => ({ ...prevParams, [filterName]: filterValue }));
    }
  };
  return (
    <Space orientation="vertical" size={"large"} style={{ width: "100%", marginTop: 14}}>
      {error && <p>{error.message}</p>}
      <UserFilter onFilterChange={onFilterChange}
      onClick={openDrawer}
      />
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={
          usersData?.users?.length > 0 ? usersData.users.map((user: User) => ({
            ...user,
            name: user.firstName + ' ' + user.lastName,
            tenant: user.tenants?.name ?? "NA",
          })) : []
        }
        pagination={{
          total: usersData?.count ?? 0,
          current: queryParams.currentPage,
          pageSize: queryParams.perPage,
          onChange: (page, size) => {
            setQueryParams((prevParams) => ({ ...prevParams, currentPage: page, perPage: size }));
          },
          showTotal: (total, range) => {
            return `Showing ${range[0]} - ${range[1]} of ${total} users`
          },
        }}
        columns={columns} />
      <NewUserDrawer isOpen={open} onClose={closeDrawer} form={form} isEditing={!!editingUser} />
    </Space>
  );
};

export default Users;
