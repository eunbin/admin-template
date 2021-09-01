import React from 'react';
import { Breadcrumb as AntdBreadcrumb, Space } from 'antd';
import menus from 'config/menus';
import { useRouter } from 'next/router';
import { findItemNested } from 'utils/common';

function Breadcrumb() {
  const router = useRouter();
  const { pathname } = router;

  const crumbs = pathname.split('/').filter((x) => x);

  return (
    <AntdBreadcrumb css={{ margin: '16px 0', textAlign: 'left' }}>
      {crumbs.map((value, index) => {
        const to = `/${crumbs.slice(0, index + 1).join('/')}`;
        const menu = findItemNested(menus, 'path', to, 'children');

        return (
          <AntdBreadcrumb.Item key={to} href={to}>
            <Space size={4}>
              {menu?.icon}
              <span>{menu?.name}</span>
            </Space>
          </AntdBreadcrumb.Item>
        );
      })}
    </AntdBreadcrumb>
  );
}

export default Breadcrumb;
