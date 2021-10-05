import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Space } from 'antd';
import { ProcessStatItem } from 'api/misApi/process';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

const cardStyle = css`
  width: 300px;
  // height: "100px";
  // background: color || '#fff';
  border: 1px solid #999;
  margin-bottom: 10px;
  .ant-card-body {
    padding: 0;
  }
`;

const CardHeader = styled.p(css`
  padding: 10px;
  margin: 0;
  border-bottom: 1px solid #333;
  text-align: center;
  font-weight: bold;
`);

const CardRow = styled.p(css`
  padding: 10px;
  margin: 0;
  border-bottom: 1px solid #333;
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
    <Card className={className} css={cardStyle}>
      <CardHeader>{`${patient_name} (${client_name})`}</CardHeader>
      <CardRow>{client_note}</CardRow>
      <CardRow>
        작업 접수시간 : {dayjs(req_time).format('YYYY.MM.DD HH:mm:ss')}
      </CardRow>
      <CardRow>
        공장 시작시간 : {dayjs(start_time).format('YYYY.MM.DD HH:mm:ss')}
      </CardRow>
      <CardRow>
        마감시간 : {dayjs(deadline).format('YYYY.MM.DD')}
        {` (D${diff > 0 ? '+' : diff === 0 ? '-' : ''}${diff})`}
      </CardRow>
      <Space
        align={'center'}
        css={css`
          width: 100%;
          justify-content: center;
          padding: 6px 0;
        `}
      >
        <Button onClick={onDetailClick}>상세보기</Button>
        <Button onClick={onDeleteClick}>삭제</Button>
      </Space>
    </Card>
  );
}

export default ProcessCard;
