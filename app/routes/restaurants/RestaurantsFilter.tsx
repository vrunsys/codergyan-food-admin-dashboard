import { Button, Card, Col, Input, Row, Select } from 'antd';

type RestaurantsFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  onClick: () => void;
};

function RestaurantsFilter({onFilterChange, onClick}: RestaurantsFilterProps) {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={24}>
            <Col span={8}>
              <Input.Search style={{ width: '100%' }} placeholder="Search" onChange={(e) => onFilterChange('RestaurantSearchQuery', e.target.value)}/>
            </Col>
            <Col span={8} >
              <Select
                style={{ width: '100%' }}
                placeholder="Filter"
                onChange={(RestaurantFilter) => onFilterChange('RestaurantFilterQuery', RestaurantFilter)}
                options={[
                  { value: 'admin', label: 'All' },
                  { value: 'manager', label: 'Active' },
                  { value: 'customer', label: 'Inactive' },
                ]}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Status"
                onChange={(RestaurantStatus) => onFilterChange('RestaurantStatusQuery', RestaurantStatus)}
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
          <Button type="primary" onClick={onClick}>+ Add Tenant</Button>
        </Col>
      </Row>
    </Card>
  );
}

export default RestaurantsFilter;