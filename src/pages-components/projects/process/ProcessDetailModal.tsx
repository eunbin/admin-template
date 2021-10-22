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
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { css } from '@emotion/react';
import { useMutation, useQuery } from 'react-query';
import API from 'api';
import { ProcessMemoRequest, ProcessSnapshotItem } from 'types/process';

interface Props {
  process: ProcessSnapshotItem;
  visible: boolean;
  onOk: (values: ProcessSnapshotItem) => void;
  onClose: () => void;
}

function ProcessDetailModal({ process, visible, onOk, onClose }: Props) {
  const {
    data: history,
    isLoading,
    refetch,
  } = useQuery('processDetail', () =>
    API.mis.process.getProcessDetail('1', process.id)
  );

  const addMemo = useMutation(
    (newMemo: ProcessMemoRequest) => {
      return API.mis.process.addMemo(newMemo);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const [form] = Form.useForm();

  const diff = useMemo(
    () => dayjs(new Date()).diff(dayjs(process.deadline), 'days'),
    [process.deadline]
  );

  const requestTime = dayjs(process.req_time);
  const startTime = dayjs(process.start_time);
  const deadline = dayjs(process.deadline);

  const columns = [
    {
      title: '공정',
      dataIndex: 'process_name',
      key: 'process_name',
      width: 150,
    },
    {
      title: '시작시간',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 150,
    },
    {
      title: '종료시간',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 150,
    },
    {
      title: '소요시간',
      dataIndex: 'elapsed_time',
      key: 'elapsed_time',
      width: 150,
    },
    {
      title: '작업자',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 100,
    },
    {
      title: '메모내용',
      dataIndex: 'comment',
      key: 'comment',
    },
  ];

  const handleFinish = (values: { memo: string }) => {
    // TODO
    addMemo.mutate({
      site_id: 1,
      item_uuid: process.id,
      process_id: 1,
      user_id: 1,
      comment: values.memo,
    });
  };

  return (
    <Modal
      visible={visible}
      title={`${process.patient_name} (${process.client_name})`}
      width={1200}
      okText="삭제"
      cancelText="닫기"
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(process);
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
                {dayjs(process.deadline).format('YYYY.MM.DD (ddd)')}
              </Col>
              <Col span={12}>
                마감 {diff}일 {diff === 0 ? '전' : '경과'}
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="고객 요청사항">
            {process.client_note}
          </Descriptions.Item>
        </Descriptions>

        <br />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={history}
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
          onFinish={handleFinish}
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
              <Button htmlType="submit" type={'primary'} size={'large'}>
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
