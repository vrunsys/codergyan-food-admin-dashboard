import { Col, Row, Card, Typography, Statistic, Space, Button, List, Skeleton, Tag } from "antd";
import Icon, { BarChartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { Route } from "./+types/home";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { Link } from "react-router";


const { Title, Text } = Typography;

const list = [
    {
        OrderSummary: 'Peperoni, Margarita ...',
        address: 'Bandra, Mumbai',
        amount: 1200,
        status: 'preparing',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
    {
        OrderSummary: 'Paneer, Chicken BBQ ...',
        address: 'Balurghat, West bengal',
        amount: 2000,
        status: 'on the way',
        loading: false,
    },
];

interface CardTitleProps {
  title: string;
  PrefixIcon: typeof Icon;
}


const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  return (
    <Space>
      <Icon component={PrefixIcon} />
      {title}
    </Space>
  );
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const hour = new Date(Date.now()).getHours();
  const greet = hour > 12 ? hour > 16 ? "Good evening" : "Good Afternoon" : "Good Morning"
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div>
      <Title level={4}>{greet}, {user.firstName} {user.lastName}</Title>
      <Row className="mt-4" gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Statistic title="Total Orders" value={52} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Total Sales" value={700000} prefix="₹" />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<CardTitle title="Sales" PrefixIcon={BarChartOutlined} />}
                variant={'borderless'}></Card>
            </Col>
          </Row>

        </Col>
      <Col span={12}>
        <Card
          variant={'borderless'}
          title={<CardTitle title="Recent orders" PrefixIcon={ShoppingCartOutlined} />}>
          <List
            className="demo-loadmore-list"
            loading={false}
            itemLayout="horizontal"
            loadMore={true}
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <a href="https://ant.design">{item.OrderSummary}</a>
                    }
                    description={item.address}
                  />
                  <Row style={{ flex: 1 }} justify="space-between">
                    <Col>
                      <Text strong>₹{item.amount}</Text>
                    </Col>
                    <Col>
                      <Tag color="volcano">{item.status}</Tag>
                    </Col>
                  </Row>
                </Skeleton>
              </List.Item>
            )}
          />
          <div style={{ marginTop: 20 }}>
            <Button type="link">
              <Link to="/orders">See all orders</Link>
            </Button>
          </div>
        </Card>
      </Col>
      </Row>
    </div>
  );
}
