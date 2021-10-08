import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Space, Typography } from 'antd';
import { ProcessStatItem } from 'api/misApi/process';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

const CardRow = styled.p(css`
  padding: 0 10px;
`);

const BLINK_DURATION = 5000;

interface CardItemProps {
  data: ProcessStatItem;
  initialBlink?: boolean;
  onDetailClick?: () => void;
  onDeleteClick?: () => void;
}

function ProcessCard({
  data,
  initialBlink,
  onDetailClick,
  onDeleteClick,
}: CardItemProps) {
  const {
    patient_name,
    client_name,
    client_note,
    req_time,
    start_time,
    deadline,
  } = data;

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
      <Divider />
      <CardRow>{client_note}</CardRow>
      <Divider />
      <CardRow>
        작업 접수시간 : {dayjs(req_time).format('YYYY.MM.DD HH:mm:ss')}
      </CardRow>
      <Divider />
      <CardRow>
        공장 시작시간 : {dayjs(start_time).format('YYYY.MM.DD HH:mm:ss')}
      </CardRow>
      <Divider />
      <CardRow>
        마감시간 : {dayjs(deadline).format('YYYY.MM.DD')}
        {` (D${diff > 0 ? '+' : diff === 0 ? '-' : ''}${diff})`}
      </CardRow>
      <Divider />
      <Space
        align={'center'}
        css={css`
          width: 100%;
          justify-content: center;
          padding: 10px 0;
        `}
      >
        <Button onClick={onDetailClick}>상세보기</Button>
        <Button onClick={onDeleteClick}>삭제</Button>
      </Space>
    </Card>
  );
}

export default ProcessCard;
