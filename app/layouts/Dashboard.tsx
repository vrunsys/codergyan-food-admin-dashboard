import type { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, NavLink, href } from "react-router";
import type { RootState } from "../store";
import { Layout, Menu, Breadcrumb, theme, type MenuProps, Flex, Badge, Space, Dropdown, Avatar } from "antd";
import {
  BellFilled,
  BuildOutlined,
  GiftOutlined,
  HomeOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useLogout } from "~/api/AuthApi";

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
  const paths = window.location.pathname.split("/").map((path) => {
      const title =  path.toLowerCase()
      
      return title === "" ? {title: "Home"} : {title: title};
      

  })
  console.log(paths);
  
  const { user } = useSelector((state: RootState) => state.user);
  const {logoutMutate} = useLogout();
  if (user === null) return <Navigate to={"/auth/login"} replace />;
  return (
    <div>
      <Layout style={{minHeight: '100vh'}}>
        <Sider theme="light" width={200} collapsible style={{ backgroundColor: colorWhite }}>
          <Menu
            theme="light"
            mode="vertical"
            defaultSelectedKeys={['/']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Sider>
        <Layout style={{ padding: "0" }}>
          <Header style={{ paddingLeft: '16px', paddingRight: '16px', backgroundColor: colorBgContainer }}>
            <Flex gap={"middle"} align="start" justify="space-between">
              <Badge text={`${user.role === 'admin' ? 'You are an admin' : user.tenants?.name }`} status="success" />
              <Space size={16} align="center" >
                <Badge dot>
                  <BellFilled />
                </Badge>

                <Dropdown placement="bottomRight" menu={{
                  items: [
                    {
                      key: "logout",
                      label: "logout",
                      onClick: () => logoutMutate()
                    }
                  ]
                }}>
                  <Avatar>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Avatar>
                </Dropdown>

              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px"}}>
            <Breadcrumb separator={<RightOutlined/>} items={[...paths]}/>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default DashboardLayout;
