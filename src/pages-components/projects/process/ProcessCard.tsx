import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Space } from 'antd';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { useModal } from 'contexts/ModalProvider';
import useConfirm from 'hooks/useConfirm';
import useNotification from 'hooks/useNotification';
import { ProcessSnapshotItem } from 'types/process';

const CardRow = styled.p(css`
  padding: 0 10px;
`);

const BLINK_DURATION = 5000;

interface Props {
  siteId: number;
  item: ProcessSnapshotItem;
  initialBlink?: boolean;
  fullContent?: boolean;
  onDelete: (item: ProcessSnapshotItem) => void;
  onProcessClose: (item: ProcessSnapshotItem) => void;
}

function ProcessCard({
  siteId,
  item,
  initialBlink,
  fullContent,
  onDelete,
  onProcessClose,
}: Props) {
  const { showModal } = useModal();
  const { showConfirm } = useConfirm();

  const {
    patient_name,
    client_name,
    client_note,
    req_time,
    start_time,
    deadline,
  } = item;

  const [className, setClassName] = useState(initialBlink ? 'blink' : '');

  useEffect(() => {
    initialBlink &&
      setTimeout(() => {
        setClassName('');
      }, BLINK_DURATION);
  }, [initialBlink]);

  const diff = useMemo(
    () => dayjs(new Date()).diff(dayjs(deadline), 'days'),
    [deadline]
  );

  const handleDetailClick = useCallback(
    (item: ProcessSnapshotItem) => () => {
      import('pages-components/projects/process/ProcessDetailModal').then(
        ({ default: Component }) => {
          showModal({
            component: Component,
            modalProps: {
              item,
              siteId,
              onOk: (item: ProcessSnapshotItem) => {
                onDelete(item);
              },
            },
          });
        }
      );
    },
    [onDelete, showModal]
  );

  const handleDeleteClick = useCallback(
    (item: ProcessSnapshotItem) => () => {
      showConfirm({
        content: `${item.patient_name} (${item.client_name}) 를 삭제하시겠습니까?`,
        okText: '삭제',
        cancelText: '취소',
        onOk: () => {
          onDelete(item);
        },
      });
    },
    [onDelete, showConfirm]
  );

  const handleEndClick = useCallback(
    (item: ProcessSnapshotItem) => () => {
      showConfirm({
        content: `${item.patient_name} (${item.client_name}) 를 종료하시겠습니까?`,
        okText: '종료',
        cancelText: '취소',
        onOk: () => {
          onProcessClose(item);
        },
      });
    },
    [onProcessClose, showConfirm]
  );

  return (
    <Card
      title={`${patient_name} (${client_name})`}
      className={className}
      headStyle={{ textAlign: 'center' }}
      bodyStyle={{ padding: 0, width: 300 }}
      css={css`
        margin-bottom: 10px;
        .ant-divider-horizontal {
          margin: 0 0 10px 0;
        }
      `}
      hoverable
    >
      {fullContent && (
        <>
          <Divider />
          <CardRow>{client_note}</CardRow>
          <Divider />
          <CardRow>
            작업 접수시간 : {dayjs(req_time).format('YYYY.MM.DD HH:mm:ss')}
          </CardRow>
          <Divider />
          <CardRow>
            공정 시작시간 : {dayjs(start_time).format('YYYY.MM.DD HH:mm:ss')}
          </CardRow>
          <Divider />
          <CardRow>
            마감시간 : {dayjs(deadline).format('YYYY.MM.DD')}
            {` (D${diff > 0 ? '+' : diff === 0 ? '-' : ''}${diff})`}
          </CardRow>
        </>
      )}
      <Divider />
      <Space
        align={'center'}
        css={css`
          width: 100%;
          justify-content: center;
          padding: 10px 0;
        `}
      >
        <Button onClick={handleDetailClick(item)}>상세보기</Button>
        <Button onClick={handleDeleteClick(item)}>삭제</Button>
        <Button onClick={handleEndClick(item)}>종료</Button>
      </Space>
    </Card>
  );
}

export default ProcessCard;
