import {useUsers, type User} from '../../api/users';
import { Space, Table} from 'antd';
import UserFilter from './UserFilter';
import { useState } from 'react';
import NewUserDrawer from './NewUserDrawer';


const Users = () => {
  const { usersData, isLoading, error } = useUsers();
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
 
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
  ];

  
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%", marginTop: 14}}>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      <UserFilter onFilterChange={(filterName: string, filterValue: string) => {
        console.log(filterName, filterValue);
      }}
      onClick={openDrawer}
      />
      <Table
        rowKey="id"
        dataSource={
          usersData?.length > 0 ? usersData.map((user: User) => ({
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            role: user.role,
          })) : []
        }
        columns={columns} />
      <NewUserDrawer isOpen={open} onClose={closeDrawer}/>
    </Space>
  );
};

export default Users;