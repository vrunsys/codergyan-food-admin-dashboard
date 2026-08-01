import type { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, NavLink } from "react-router";
import type { RootState } from "../store";
import { Layout, Menu, Breadcrumb, theme, type MenuProps } from "antd";
import {
  BuildOutlined,
  GiftOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
const { Sider, Content, Header } = Layout;

const items: MenuProps["items"] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <NavLink to="/">Home</NavLink>,
  },
  {
    key: "/users",
    icon: <UsergroupAddOutlined />,
    label: <NavLink to="/users">Users</NavLink>,
  },
  {
    key: "/restaurants",
    icon: <BuildOutlined />,
    label: <NavLink to="/restaurants">Restaurants</NavLink>,
  },
  {
    key: "/products",
    icon: <ShoppingCartOutlined />,
    label: <NavLink to="/products">Products</NavLink>,
  },
  {
    key: "/promos",
    icon: <GiftOutlined />,
    label: <NavLink to="/promos">Promos</NavLink>,
  },
];

const DashboardLayout: FC = () => {
  const {
    token: { colorWhite, colorBgContainer },
  } = theme.useToken();

  const { user } = useSelector((state: RootState) => state.user);
  if (user === null) return <Navigate to={"/auth/login"} replace />;
  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Layout>
        <Sider width={200} collapsible style={{ backgroundColor: colorWhite }}>
          <Menu
            theme="light"
            mode="vertical"
            defaultSelectedKeys={['/']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Sider>
        <Layout style={{ padding: "0" }}>
          <Header style={{ padding: "0", backgroundColor: colorBgContainer }}></Header>
          <Content
            style={{
              padding: 24,
              margin: 0,
              
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
