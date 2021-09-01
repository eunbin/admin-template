import React from 'react';
import { Form, Col, Row, Input, Select, DatePicker } from 'antd';
import { useEffect } from 'react';
import { RightDrawer } from 'components';

const { Option } = Select;

interface Props {
  visible: boolean;
  title?: string;
  data: any;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

function DetailDrawer({ visible, data, onSubmit, onClose }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(data);
  }, [form, data]);

  return (
    <RightDrawer
      visible={visible}
      title={'Edit'}
      onSubmit={() => onSubmit(form.getFieldsValue())}
      onClose={onClose}
    >
      <Form
        form={form}
        initialValues={data}
        layout="vertical"
        requiredMark="optional"
        hideRequiredMark={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="athlete"
              label="Athlete"
              rules={[{ required: true, message: 'Please enter user name' }]}
              required
              tooltip="This is a required field"
            >
              <Input placeholder="Please enter athlete" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="age"
              label="Age"
              rules={[{ required: true, message: 'Please enter user age' }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="owner"
              label="Owner"
              rules={[{ required: true, message: 'Please select an owner' }]}
            >
              <Select placeholder="Please select an owner">
                <Option value="xiao">Xiaoxiao Fu</Option>
                <Option value="mao">Maomao Zhou</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please choose the type' }]}
            >
              <Select placeholder="Please choose the type">
                <Option value="private">Private</Option>
                <Option value="public">Public</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="approver"
              label="Approver"
              rules={[
                { required: true, message: 'Please choose the approver' },
              ]}
            >
              <Select placeholder="Please choose the approver">
                <Option value="jack">Jack Ma</Option>
                <Option value="tom">Tom Liu</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateTime"
              label="DateTime"
              rules={[
                { required: true, message: 'Please choose the dateTime' },
              ]}
            >
              <DatePicker.RangePicker
                css={{ width: '100%' }}
                // @ts-ignore
                getPopupContainer={(trigger) => trigger.parentElement}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'please enter url description',
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="please enter url description"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </RightDrawer>
  );
}

export default DetailDrawer;
