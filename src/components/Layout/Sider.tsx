import { Layout } from 'antd';
import React from 'react';
import { Menu } from 'components';

const { Sider: AntdSider } = Layout;

interface Props {
  collapsed: boolean;
  onCollapse: (a: any, b: any) => void;
}

function Sider({ collapsed, onCollapse }: Props) {
  return (
    <AntdSider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width="250"
      css={{
        overflow: 'auto',
        height: '100vh',
        marginTop: 64,
        position: 'fixed',
        left: 0,
        zIndex: 2,
      }}
    >
      <Menu />
    </AntdSider>
  );
}

export default Sider;
