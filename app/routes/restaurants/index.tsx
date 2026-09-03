import { useTenants } from '../../api/tenants';
import {Space, Table} from 'antd';
import RestaurantsFilter from './RestaurantsFilter';
import NewTenantDrawer from './NewTenantDrawer';
import { useState } from 'react';
import { PER_PAGE, CURRENT_PAGE } from '~/constants';


const Users = () => {
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: CURRENT_PAGE,
  });
  const { tenantsData, isLoading, error } = useTenants(queryParams);
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
    <Space orientation="vertical" size={"large"} style={{ width: "100%", marginTop: 14}}>
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
          tenantsData?.tenants?.length > 0 ? tenantsData.tenants.map((tenant: any) => ({
            id: tenant.id,
            name: tenant.name,
            address: tenant.address,
          })) : []
        }
        pagination={
          {
            total: tenantsData?.count ?? 0,
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,
            onChange: (page, pageSize) => setQueryParams({ ...queryParams, currentPage: page, perPage: pageSize }),
          }
        }
        columns={columns} />
      <NewTenantDrawer isOpen={open} onClose={closeDrawer} />
    </Space>
  );
};

export default Users;