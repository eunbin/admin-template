import { Row, Space } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  actions: ReactNode;
  search?: ReactNode;
}

function DataGridToolbar({ actions, search }: Props) {
  return (
    <Row justify="space-between" align="middle" css={{ marginBottom: 10 }}>
      <Space size={4}>{actions}</Space>
      <Space size={4}>{search}</Space>
    </Row>
  );
}

export default DataGridToolbar;
