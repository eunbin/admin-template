import { Button, Modal, Space, Table } from 'antd';
import React, { useState } from 'react';
import { User } from 'api/mockApi/user';
import Link from 'next/link';
import UpdateUserModal from 'pages-components/projects/settings/users/UpdateUserModal';

interface Props {
  users: User[];
  loading: boolean;
}

function UserTable({ users, loading }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
      render: (text: string, record: User) => (
        <Link href={`/projects/settings/users/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a: User, b: User) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: User) => (
        <Space size="small">
          <Button type="default" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Button type="default" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: (record: User) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpdate = (user: User) => {
    setSelectedUser(user);
    setVisible(true);
  };

  const handleDelete = (user: User) => {
    Modal.warning({
      title: 'This is a warning message',
      content: 'some messages...some messages...',
      onOk: () => {},
    });
  };

  return (
    <>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={users}
        bordered
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
      <UpdateUserModal
        visible={visible}
        user={selectedUser}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
}

export default UserTable;
