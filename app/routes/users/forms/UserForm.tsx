import React from 'react';
import { Card, Col, Form, Row, Input, Space, Select } from 'antd';

const UserForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Space orientation='vertical' size={'medium'}>
          <Card title={"Basic Information"} variant='borderless'>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"First Name"} name={"firstName"}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Last Name"} name={"lastName"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Email"} name={"email"}>
                  <Input type={'email'}/>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Security Information"} variant='borderless'>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Password"} name={"password"}>
                  <Input type={'password'}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Confirm Password"} name={"confirmPassword"}>
                  <Input type={'password'}/>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={"Role & Tenant Information"} variant='borderless'>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label={"Role"} name={"role"}>
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
                <Form.Item label={"Restaurant"} name={"tenantId"}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Restaurants"
                    options={[
                      { value: 'Tenant 1', label: 'Tenant-1' },
                      { value: 'Tenant 2', label: 'Tenant-2' },
                      { value: 'Tenant 3', label: 'Tenant-3' },
                    ]}
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