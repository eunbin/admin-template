import React from 'react';
import { Layout } from 'antd';

interface Props {
  children: React.ReactNode;
}
function ErrorLayout({ children }: Props) {
  return <Layout css={{ minHeight: '100vh' }}>{children}</Layout>;
}

export default ErrorLayout;
