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
              <Input.Search style={{ width: '100%' }} placeholder="Search" onChange={(e) => onFilterChange('q', e.target.value)}/>
            </Col>
            <Col span={8} >
              <Select
                style={{ width: '100%' }}
                placeholder="Filter"
                onChange={(UserFilter) => onFilterChange('role', UserFilter)}
                options={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'customer', label: 'Customer' },
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