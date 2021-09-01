import React from 'react';
import PageLayout from 'layouts/PageLayout';
import { Card, Col, Row, Statistic } from 'antd';
import {
  LikeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

function Dashboard() {
  return (
    <PageLayout>
      <Row gutter={[12, 12]}>
        <Col lg={6} md={12}>
          <Card css={{ height: '100%' }}>
            <Statistic title="Active Users" value={112893} />
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card css={{ height: '100%' }}>
            <Statistic
              title="Feedback"
              value={1128}
              prefix={<LikeOutlined />}
            />
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card css={{ height: '100%' }}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card css={{ height: '100%' }}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col lg={18} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
        <Col lg={6} md={24}>
          <Row gutter={[12, 12]}>
            <Col lg={24} md={12}>
              <Card css={{ height: '100%' }}>
                <p>Card content</p>
              </Card>
            </Col>
            <Col lg={24} md={12}>
              <Card css={{ height: '100%' }}>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={12} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
        <Col lg={12} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
        <Col lg={24} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
        <Col lg={8} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
        <Col lg={8} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
        <Col lg={8} md={24}>
          <Card css={{ height: '100%' }}>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  );
}

export default Dashboard;
