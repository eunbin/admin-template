import { Button, Form, Input, Modal, Space } from 'antd';
import React, { useMemo } from 'react';
import { ProcessStatItem } from 'api/misApi/process';
import dayjs from 'dayjs';

interface Props {
  data: ProcessStatItem;
  visible: boolean;
  onOk: (values: ProcessStatItem) => void;
  onClose: () => void;
}

function ProcessDetailModal({ data, visible, onOk, onClose }: Props) {
  const [form] = Form.useForm();

  const diff = useMemo(
    () => dayjs(new Date()).diff(dayjs(data.deadline), 'days'),
    [data.deadline]
  );

  return (
    <Modal
      visible={visible}
      title="상세보기"
      okText="삭제"
      cancelText="닫기"
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(data);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <>
        <div>
          작업 접수시간 : {dayjs(data.req_time).format('YYYY.MM.DD HH:mm:ss')}
        </div>
        <div>
          공장 시작시간 : {dayjs(data.start_time).format('YYYY.MM.DD HH:mm:ss')}
        </div>
        <div>
          마감시간 : {dayjs(data.deadline).format('YYYY.MM.DD')}
          {` (D${diff > 0 ? '+' : diff === 0 ? '-' : ''}${diff})`}{' '}
        </div>

        <div>고객 요청사항: {data.client_note}</div>

        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item name="memo" label="내 메모">
            <Space align={'center'}>
              <Input />
              <Button type={'primary'}>입력</Button>
            </Space>
          </Form.Item>
        </Form>
      </>
    </Modal>
  );
}

export default ProcessDetailModal;
