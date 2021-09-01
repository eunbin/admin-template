import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import { User } from 'api/mockApi/user';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface Props {
  visible: boolean;
  user: User | null;
  onOk: (values: Values) => void;
  onCancel: () => void;
}

function UpdateUserModal({ visible, user, onOk, onCancel }: Props) {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title={user?.name}
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="modifier"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateUserModal;
