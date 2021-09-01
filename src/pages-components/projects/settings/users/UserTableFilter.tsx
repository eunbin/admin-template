import { Button, Col, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

export interface UserFilters {
  name: string;
  username: string;
  address: string;
}

interface Props {
  onSearch: (filters: UserFilters) => void;
}

function UserTableFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    username: '',
    address: '',
  });

  const handleChange = (e: any) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => onSearch(filters);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <Input.Group css={{ marginBottom: 10 }}>
        <Row gutter={8}>
          <Col span={4}>
            <Input
              placeholder="Input Name"
              name="name"
              onChange={handleChange}
            />
          </Col>
          <Col span={4}>
            <Input
              placeholder="Input Username"
              name="username"
              onChange={handleChange}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder="Input Address"
              name="address"
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Button
              htmlType="submit"
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Input.Group>
    </form>
  );
}

export default UserTableFilter;
