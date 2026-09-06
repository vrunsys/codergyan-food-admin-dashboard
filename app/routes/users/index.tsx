import {useUsers, type User} from '../../api/users';
import { Space, Table} from 'antd';
import UserFilter from './UserFilter';
import { useMemo, useState } from 'react';
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

  const debouncedOnFilterChange = useMemo(() => {
    return debounce((value) => {
      setQueryParams((prevParams) => ({ ...prevParams, 'q': value }));
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
            setQueryParams((prevParams) => ({ ...prevParams, currentPage: page, perPage: size }));
          },
        }}
        columns={columns} />
      <NewUserDrawer isOpen={open} onClose={closeDrawer}/>
    </Space>
  );
};

export default Users;