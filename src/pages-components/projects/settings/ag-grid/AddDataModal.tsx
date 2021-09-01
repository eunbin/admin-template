import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface Props {
  visible: boolean;
  onOk: (values: Values) => void;
  onClose: () => void;
}

function AddDataModal({ visible, onOk, onClose }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Add"
      okText="Create"
      cancelText="Cancel"
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
            form.resetFields();
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
          name="athlete"
          label="Athlete"
          rules={[
            {
              required: true,
              message: 'Please input athlete',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: 'Please enter user age' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddDataModal;
