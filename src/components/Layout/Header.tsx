import {
  Layout,
  Menu,
  Avatar,
  Popover,
  Badge,
  List,
  Tooltip,
  Typography,
} from 'antd';
import { BellOutlined, RightOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import menus from 'config/menus';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { css } from '@emotion/react';

const { Header: AntdHeader } = Layout;
const { SubMenu } = Menu;

const StyledRightContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  position: 'absolute',
  top: 0,
  right: 0,
});

function Header() {
  const router = useRouter();
  const { pathname } = router;

  const gnbMenus = useMemo(
    () => menus.filter((route) => route.path !== '/'),
    []
  );
  const defaultMenu = useMemo(
    () => `/${pathname.split('/').filter((path) => path)[0]}`,
    [pathname]
  );

  const [notifications, setNotifications] = useState([
    {
      title: 'New User is registered.',
      date: new Date(Date.now() - 10000000),
    },
    {
      title: 'Application has been approved.',
      date: new Date(Date.now() - 50000000),
    },
  ]);

  const onAllNotificationsRead = () => {
    setNotifications([]);
  };

  const handleClick = (e: any) => {
    if (e.key === 'SignOut') {
      router.push('/');
    }
  };

  return (
    <AntdHeader style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Logo />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[defaultMenu]}>
        {gnbMenus.map((route) => {
          return (
            <Menu.Item key={route.path}>
              <Link href={route.path}>{route.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
      <StyledRightContainer>
        <Popover
          placement="bottomRight"
          trigger="click"
          key="notifications"
          content={
            <div
              css={css`
                padding: 0;
                width: 320px;
              `}
            >
              <List
                itemLayout="horizontal"
                dataSource={notifications}
                locale={{
                  emptyText: 'You have viewed all notifications.',
                }}
                renderItem={(item) => (
                  <List.Item
                    css={css`
                      transition: all 0.3s;
                      padding: 12px 24px;
                      cursor: pointer;
                      &:hover {
                        background-color: #eeeeee;
                      }
                    `}
                  >
                    <List.Item.Meta
                      title={
                        <Tooltip title={item.title}>
                          <span>{item.title}</span>
                        </Tooltip>
                      }
                      description={'item.date'}
                    />
                    <RightOutlined css={{ fontSize: 10, color: '#ccc' }} />
                  </List.Item>
                )}
              />
              {notifications.length ? (
                <div
                  onClick={onAllNotificationsRead}
                  css={css`
                    text-align: center;
                    height: 48px;
                    line-height: 48px;
                    cursor: pointer;
                    &:hover {
                      background-color: #eeeeee;
                    }
                  `}
                >
                  <Typography.Text>Clear notifications</Typography.Text>
                </div>
              ) : null}
            </div>
          }
        >
          <Badge
            count={notifications.length}
            dot
            offset={[-10, 10]}
            css={css`
              width: 48px;
              height: 48px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 24px;
              cursor: pointer;
              &:hover {
                svg {
                  color: #fff;
                }
              }
            `}
          >
            <BellOutlined
              css={css`
                color: #b2b0c7;
                font-size: 22px;
              `}
            />
          </Badge>
        </Popover>

        <Menu theme="dark" key="user" mode="horizontal" onClick={handleClick}>
          <SubMenu
            key="1"
            title={
              <>
                <span>guest</span>
                <Avatar css={{ marginLeft: 8 }}>A</Avatar>
              </>
            }
          >
            <Menu.Item
              key="SignOut"
              onClick={() => {
                router.push('/');
              }}
            >
              <span>Sign out</span>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </StyledRightContainer>
    </AntdHeader>
  );
}

function Logo() {
  return (
    <div
      css={{
        float: 'left',
        width: '120px',
        height: '31px',
        margin: '16px 24px 16px 0',
        background: 'rgba(255, 255, 255, 0.2)',
      }}
    />
  );
}

export default Header;
