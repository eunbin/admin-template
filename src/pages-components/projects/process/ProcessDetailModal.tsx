import {
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
  Space,
  Table,
} from 'antd';
import React, { useMemo } from 'react';
import { ProcessSnapshotItem } from 'api/misApi/process';
import dayjs from 'dayjs';
import { User } from 'api/mockApi/user';
import Link from 'next/link';
import TextArea from 'antd/es/input/TextArea';
import { css } from '@emotion/react';

interface Props {
  data: ProcessSnapshotItem;
  visible: boolean;
  onOk: (values: ProcessSnapshotItem) => void;
  onClose: () => void;
}

function ProcessDetailModal({ data, visible, onOk, onClose }: Props) {
  const [form] = Form.useForm();

  const diff = useMemo(
    () => dayjs(new Date()).diff(dayjs(data.deadline), 'days'),
    [data.deadline]
  );

  const requestTime = dayjs(data.req_time);
  const startTime = dayjs(data.start_time);
  const deadline = dayjs(data.deadline);

  const columns = [
    {
      title: '공정',
      dataIndex: 'process',
      key: 'process',
      render: (text: string, record: User) => (
        <Link href={`/projects/settings/users/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: '시작시간',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '종료시간',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '소요시간',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '작업자',
      dataIndex: 'worker',
      key: 'worker',
    },
    {
      title: '메모내용',
      dataIndex: 'memo',
      key: 'memo',
    },
  ];

  return (
    <Modal
      visible={visible}
      title={`${data.patient_name} (${data.client_name})`}
      width={800}
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
      css={css`
        .ant-modal-footer {
          text-align: center;
          > button {
            width: 88px;
          }
        }
      `}
    >
      <>
        <Descriptions bordered layout="horizontal" column={1}>
          <Descriptions.Item label="작업 접수시간">
            <Row>
              <Col span={12}>
                {requestTime.format('YYYY.MM.DD (ddd) HH:mm')}
              </Col>
              <Col span={12}>
                접수 {dayjs(new Date()).diff(dayjs(requestTime), 'days')}일 경과
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="마감시간">
            <Row>
              <Col span={12}>
                {dayjs(data.deadline).format('YYYY.MM.DD (ddd)')}
              </Col>
              <Col span={12}>
                마감 {diff}일 {diff === 0 ? '전' : '경과'}
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="고객 요청사항">
            {data.client_note}
          </Descriptions.Item>
        </Descriptions>

        <br />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={[]}
          bordered
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />

        <Form
          form={form}
          name="form_in_modal"
          initialValues={{ memo: 'memo' }}
          style={{
            marginTop: 20,
          }}
        >
          <Form.Item
            name="memo"
            label="내 메모"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Space align={'center'}>
              <TextArea
                rows={2}
                placeholder={'공정 N 의 메모를 입력하세요.'}
                style={{ width: 500 }}
              />
              <Button type={'primary'} size={'large'}>
                입력
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </>
    </Modal>
  );
}

export default ProcessDetailModal;
