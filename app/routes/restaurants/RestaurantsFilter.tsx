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
            <Col span={16}>
              <Input.Search style={{ width: '100%' }} placeholder="Search" onChange={(e) => onFilterChange('q', e.target.value)}/>
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