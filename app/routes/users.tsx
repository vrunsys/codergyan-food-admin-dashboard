import {useUsers, type User} from '../api/users';
import {Table} from 'antd';

const Users = () => {
  const { usersData, isLoading, error } = useUsers();
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
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      <Table
        dataSource={
          usersData?.length > 0 ? usersData.map((user: User) => ({
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            role: user.role,
          })) : []
        }
        columns={columns} />
    </div>
  );
};

export default Users;