import React from 'react';
// https://ant.design/components/icon/
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  ProjectOutlined,
  TableOutlined,
} from '@ant-design/icons';

export const menus: any[] = [
  {
    path: '/projects',
    name: 'Projects',
    children: [
      {
        path: '/projects/dashboard',
        name: 'Dashboard',
        icon: <DashboardOutlined />,
      },
      {
        path: '/projects/kanban',
        name: 'Kanban',
        icon: <ProjectOutlined />,
      },
      {
        path: '/projects/settings',
        name: 'Settings',
        icon: <SettingOutlined />,
        children: [
          {
            path: '/projects/settings/ag-grid',
            name: 'Ag Grid',
            icon: <TableOutlined />,
          },
          {
            path: '/projects/settings/users',
            name: 'Users',
            icon: <UserOutlined />,
          },
          {
            path: '/projects/settings/teams',
            name: 'Teams',
            icon: <TeamOutlined />,
          },
        ],
      },
    ],
  },
  {
    path: '/issues',
    name: 'Issues',
    children: [
      {
        path: '/issues/dashboard',
        name: 'Dashboard',
        icon: <DashboardOutlined />,
      },
      {
        path: '/issues/kanban',
        name: 'Kanban',
        icon: <ProjectOutlined />,
      },
    ],
  },
];

export default menus;
