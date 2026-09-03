import {useUsers, type User} from '../../api/users';
import { Space, Table} from 'antd';
import UserFilter from './UserFilter';
import { useState } from 'react';
import NewUserDrawer from './NewUserDrawer';
import { PER_PAGE, CURRENT_PAGE } from '~/constants';


const Users = () => {
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: CURRENT_PAGE,
  });
  const { usersData, isLoading, error } = useUsers(queryParams);
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
    <Space orientation="vertical" size={"large"} style={{ width: "100%", marginTop: 14}}>
      {error && <p>{error.message}</p>}
      <UserFilter onFilterChange={(filterName: string, filterValue: string) => {
        console.log(filterName, filterValue);
      }}
      onClick={openDrawer}
      />
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={
          usersData?.users?.length > 0 ? usersData.users.map((user: User) => ({
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            role: user.role,
          })) : []
        }
        pagination={{
          total: usersData?.count ?? 0,
          current: queryParams.currentPage,
          pageSize: queryParams.perPage,
          onChange: (page, size) => {
            setQueryParams({ currentPage: page, perPage: size });
          },
        }}
        columns={columns} />
      <NewUserDrawer isOpen={open} onClose={closeDrawer}/>
    </Space>
  );
};

export default Users;