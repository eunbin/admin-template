import React from 'react';
import { Layout } from 'antd';

const { Footer: AntdFooter } = Layout;

function Footer() {
  return (
    <AntdFooter css={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </AntdFooter>
  );
}

export default Footer;
