import React from 'react';
import { Card, Col, Form, Row, Input, Space } from 'antd';
import { useTenants, type Tenant } from '~/api/tenants';

const { TextArea } = Input

const RestaurantForm = () => {
  return (
    <Row>
      <Col span={24}>
          <Card title={"Restaurant Information"} variant='borderless'>
              <Col>
                <Form.Item label={"Name"} name={"name"} rules={[{
                  required: true,
                  message: "Name is required"
                }]}>
                  <Input placeholder={'Restaurant Name'} />
                </Form.Item>
              
                <Form.Item label={"Address"} name={"address"}  rules={[{
                  required: true,
                  message: "Address is required"
                }]}>
                  <TextArea rows={4} placeholder={'1-234 Main St, City, State'} />
                </Form.Item>
              </Col>
          </Card>
      </Col>
    </Row>
  );
};

export default RestaurantForm;