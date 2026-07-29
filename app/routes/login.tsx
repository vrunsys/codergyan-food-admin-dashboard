import {
  Layout,
  Card,
  Space,
  Grid,
  Form,
  Input,
  Checkbox,
  Button,
  Flex,
} from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { Link } from "react-router";
import { useLogin, useSelf } from "~/api/AuthApi";

type LoginPageProps = {};

const LoginPage: FC<LoginPageProps> = () => {
  const { selfData } = useSelf();
  const { signIn } = useLogin();
  return (
    <>
      <Layout
        style={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Card
          style={{
            width: 300,
          }}
          title={
            <Space
              style={{ width: "100%", fontSize: 16, justifyContent: "center" }}
            >
              <LockFilled />
              Sign In
            </Space>
          }
        >
          <Form
            initialValues={{
              rememberMe: true,
            }}
            onFinish={(values) => {
              signIn({email: values.username, password: values.password});
            }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username" },
                { type: "email", message: "invalid email address" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Flex justify="space-between">
              <Form.Item name="rememberMe" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{paddingTop: 6}}>Forgot password?</Link>
            </Flex>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    </>
  );
};

export default LoginPage;
