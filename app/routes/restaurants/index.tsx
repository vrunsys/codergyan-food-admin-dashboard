import { useTenants } from '../../api/tenants';
import {Space, Table} from 'antd';
import RestaurantsFilter from './RestaurantsFilter';
import NewTenantDrawer from './NewTenantDrawer';

import { useState } from 'react';


const Users = () => {
  const { tenantsData, isLoading, error } = useTenants();
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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }
  ];

  
  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%", marginTop: 14}}>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      <RestaurantsFilter onFilterChange={(filterName: string, filterValue: string) => {
        console.log(filterName, filterValue);
      }}
      onClick={openDrawer}
      />
      <Table
        rowKey="id"
        dataSource={
          tenantsData?.length > 0 ? tenantsData.map((tenant: any) => ({
            id: tenant.id,
            name: tenant.name,
            address: tenant.address,
          })) : []
        }
        columns={columns} />
      <NewTenantDrawer isOpen={open} onClose={closeDrawer} />
    </Space>
  );
};

export default Users;