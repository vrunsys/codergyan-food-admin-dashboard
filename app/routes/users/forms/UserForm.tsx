import React from 'react';
import { Card, Col, Form, Row, Input, Space, Select } from 'antd';
import { useTenants, type Tenant } from '~/api/tenants';

const UserForm = () => {
  const { tenantsData } = useTenants();
  return (
    <Row>
      <Col span={24}>
        <Space orientation='vertical' size={'medium'}>
          <Card title={"Basic Information"} variant='borderless'>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"First Name"} name={"firstName"} rules={[{
                  required: true,
                  message: "First Name is required"
                }]}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Last Name"} name={"lastName"} rules={[{
                  required: true,
                  message: "Last Name is required"
                }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Email"} name={"email"} rules={[{
                  required: true,
                  message: "Email is required",
                }, {
                  type: "email",
                  message: "Invalid email"
                }]}>
                  <Input type={'email'}/>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Security Information"} variant='borderless'>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Password"} name={"password"} rules={[{
                  required: true,
                  message: "Password is required"
                }]}>
                  <Input type={'password'}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Confirm Password"} name={"confirmPassword"} rules={[{
                  required: true,
                  message: "Confirm Password is required"
                }, ({ getFieldValue }: any) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                })]}>
                  <Input type={'password'}/>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Role & Tenant Information"} variant='borderless'>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Role"} name={"role"} rules={[{
                  required: true,
                  message: "Role is required"
                }]}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select Role"
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'manager', label: 'Manager' },
                      { value: 'customer', label: 'Customer' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Restaurant"} name={"tenantId"} rules={[{
                  required: true,
                  message: "Restaurant is required"
                }]}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Restaurants"
                    options={tenantsData?.tenants?.map((tenant: Tenant) => ({ value: tenant.id, label: tenant.name }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
        
      </Col>
    </Row>
  );
};

export default UserForm;