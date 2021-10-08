import React, { useMemo } from 'react';
import menus from 'config/menus';
import { Menu as AntdMenu } from 'antd';
import { useApp } from 'contexts/AppProvider';
import { useRouter } from 'next/router';
const { SubMenu } = AntdMenu;
import Link from 'next/link';

function Menu() {
  const { pathname } = useRouter();

  const { menuOpenKeys, handleMenuOpenChange } = useApp();

  const defaultMenu = useMemo(
    () => `/${pathname.split('/').filter((path) => path)[0]}`,
    [pathname]
  );
  const lnbMenus = useMemo(
    () => menus.find((menu) => menu.path === defaultMenu),
    [defaultMenu]
  );

  return (
    <AntdMenu
      mode="inline"
      openKeys={menuOpenKeys}
      defaultSelectedKeys={[pathname]}
      onOpenChange={(keys: React.Key[]) =>
        handleMenuOpenChange(keys as string[])
      }
    >
      {lnbMenus?.children?.map((menu: any | undefined) => {
        if (!menu) {
          return <></>;
        }
        return menu.children ? (
          <SubMenu key={menu.path} icon={menu.icon} title={menu.name}>
            {menu.children.map((subRoute: any) => (
              <AntdMenu.Item key={subRoute.path} icon={subRoute.icon}>
                <Link href={subRoute.path}>{subRoute.name}</Link>
              </AntdMenu.Item>
            ))}
          </SubMenu>
        ) : (
          <AntdMenu.Item key={menu.path} icon={menu.icon}>
            <Link href={menu.path}>{menu.name}</Link>
          </AntdMenu.Item>
        );
      })}
    </AntdMenu>
  );
}

export default Menu;
