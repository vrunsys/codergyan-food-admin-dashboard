import { Button, Card, Col, Input, Row, Select } from 'antd';

type UserFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  onClick: () => void;
};

function UserFilter({onFilterChange, onClick}: UserFilterProps) {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={24}>
            <Col span={8}>
              <Input.Search style={{ width: '100%' }} placeholder="Search" onChange={(e) => onFilterChange('UserSearchQuery', e.target.value)}/>
            </Col>
            <Col span={8} >
              <Select
                style={{ width: '100%' }}
                placeholder="Filter"
                onChange={(UserFilter) => onFilterChange('UserFilterQuery', UserFilter)}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'customer', label: 'Customer' },
                ]}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Status"
                onChange={(UserStatus) => onFilterChange('UserStatusQuery', UserStatus)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'banned', label: 'Banned' },
                ]}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{
          display: 'flex',
          justifyContent: "end"
        }}>
          <Button type="primary" onClick={onClick}>+ Add User</Button>
        </Col>
      </Row>
    </Card>
  );
}

export default UserFilter;