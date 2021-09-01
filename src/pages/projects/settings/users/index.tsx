import React, { useState } from 'react';
import { Button, Row } from 'antd';
import PageLayout from 'layouts/PageLayout';
import { useQuery } from 'react-query';
import API from 'api';
import UserTableFilter, {
  UserFilters,
} from 'pages-components/projects/settings/users/UserTableFilter';
import UserTable from 'pages-components/projects/settings/users/UserTable';
import AddUserModal from 'pages-components/projects/settings/users/AddUserModal';

function Users() {
  const { data, isLoading } = useQuery('users', API.mock.users.list);

  const [visible, setVisible] = useState(false);

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAddClick = () => {
    setVisible(true);
  };

  const handleSearch = (filters: UserFilters) => {
    console.log(filters);
  };

  return (
    <PageLayout>
      <UserTableFilter onSearch={handleSearch} />
      <Row justify="end" css={{ marginBottom: 10 }}>
        <Button type="ghost" onClick={handleAddClick}>
          Add
        </Button>
      </Row>
      <UserTable users={data} loading={isLoading} />
      <AddUserModal visible={visible} onOk={handleOk} onCancel={handleCancel} />
    </PageLayout>
  );
}

export default Users;
