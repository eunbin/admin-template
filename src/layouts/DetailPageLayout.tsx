import React, { useState } from 'react';
import { Layout, PageHeader } from 'antd';
import { Header, Breadcrumb, Footer, Sider } from 'components';
import { useRouter } from 'next/router';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
}
function DetailPageLayout({ children }: Props) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed((prevState) => !prevState);
  };

  return (
    <Layout css={{ minHeight: '100vh' }}>
      <Header />
      <Layout
        css={{
          marginLeft: collapsed ? 80 : 250,
          transition: 'margin-left 0.2s',
        }}
      >
        <Sider collapsed={collapsed} onCollapse={handleCollapse} />
        <Content css={{ margin: '0 16px', overflow: 'initial', marginTop: 64 }}>
          <Breadcrumb />
          <div css={{ padding: 24, backgroundColor: '#fff' }}>
            <PageHeader title={'Detail'} onBack={() => router.back()} />
            {children}
          </div>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default DetailPageLayout;
