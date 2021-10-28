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
import { useAppDataState } from 'contexts/AppDataProvider';
import {
  DateFormat,
  getDDayString,
  getDiffDay,
  getLocaleDDayString,
} from 'utils/date';

interface Props {
  item: ProcessSnapshotItem;
  visible: boolean;
  onOk: (values: ProcessSnapshotItem) => void;
  onClose: () => void;
}

function ProcessDetailModal({ item, visible, onOk, onClose }: Props) {
  const { siteId, user } = useAppDataState();

  const {
    data: history,
    isLoading,
    refetch,
  } = useQuery('processDetail', () =>
    API.mis.process.getProcessDetail('1', item.id)
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

  const startTime = dayjs(item.start_time);
  const deadline = dayjs(item.deadline);

  const columns = [
    {
      title: '공정',
      dataIndex: 'process_name',
      key: 'process_name',
      width: 100,
    },
    {
      title: '시작시간',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 180,
      render: (value: string) => (
        <span>{dayjs(value).format(DateFormat.timestamp)}</span>
      ),
    },
    {
      title: '종료시간',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 180,
      render: (value: string) => (
        <span>{value && dayjs(value).format(DateFormat.timestamp)}</span>
      ),
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
      width: 120,
    },
    {
      title: '메모내용',
      dataIndex: 'comment',
      key: 'comment',
    },
  ];

  const handleFinish = (values: { memo: string }) => {
    addMemo.mutate({
      site_id: siteId,
      item_uuid: item.id,
      process_id: item.process_id,
      user_id: user.id,
      comment: values.memo,
    });
  };

  return (
    <Modal
      visible={visible}
      title={`${item.patient_name} (${item.client_name})`}
      width={1200}
      okText="삭제"
      cancelText="닫기"
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(item);
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
        <Descriptions
          bordered
          layout="horizontal"
          column={1}
          labelStyle={{ width: 280 }}
        >
          <Descriptions.Item label="작업 접수시간">
            <Row>
              <Col span={12}>
                {dayjs(item.req_time).format(DateFormat.dateTime)}
              </Col>
              <Col span={12}>접수 {getLocaleDDayString(item.req_time)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="마감시간">
            <Row>
              <Col span={12}>
                {dayjs(item.deadline).format(DateFormat.dateDay)}
              </Col>
              <Col span={12}>마감 {getLocaleDDayString(item.deadline)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="고객 요청사항">
            {item.client_note}
          </Descriptions.Item>
        </Descriptions>

        <br />

        <Table
          rowKey="process_id"
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
