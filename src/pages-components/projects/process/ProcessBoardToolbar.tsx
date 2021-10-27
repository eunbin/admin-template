import { Col, Radio, Row, Switch, Typography } from 'antd';
import React, { useCallback } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio/interface';

export type SortFieldType = 'client_name' | 'patient_name' | 'deadline';

interface Props {
  isMaxHeight: boolean;
  sortField: SortFieldType;
  isAsc: boolean;
  onCardHeightChange: (isMaxHeight: boolean) => void;
  onSortChange: (field: SortFieldType, isAsc: boolean) => void;
}

function ProcessBoardToolbar({
  isMaxHeight,
  sortField,
  isAsc,
  onCardHeightChange,
  onSortChange,
}: Props) {
  const handleMaxHeightChange = useCallback(
    (checked: boolean) => {
      onCardHeightChange(checked);
    },
    [onCardHeightChange]
  );

  const handleSortChange = useCallback(
    (e: RadioChangeEvent) => {
      const value = e.target.value;
      onSortChange(value, isAsc);
    },
    [isAsc, onSortChange]
  );

  const handleIsAscChange = useCallback(
    (checked: boolean) => {
      onSortChange(sortField, checked);
    },
    [onSortChange, sortField]
  );

  return (
    <Row gutter={32} justify={'start'} css={{ padding: 12 }}>
      <Col>
        <Row gutter={12}>
          <Col>
            <Typography.Text strong>카드높이</Typography.Text>
          </Col>
          <Col>
            <Switch
              checkedChildren="최대화"
              unCheckedChildren="최소화"
              defaultChecked={isMaxHeight}
              onChange={handleMaxHeightChange}
            />
          </Col>
        </Row>
      </Col>

      <Col>
        <Row gutter={12}>
          <Col>
            <Typography.Text strong>정렬</Typography.Text>
          </Col>
          <Col>
            <Radio.Group onChange={handleSortChange} value={sortField}>
              <Radio value={'patient_name'}>환자명</Radio>
              <Radio value={'client_name'}>고객명</Radio>
              <Radio value={'deadline'}>마감일</Radio>
            </Radio.Group>
            <Switch
              checkedChildren="오름차순"
              unCheckedChildren="내림차순"
              defaultChecked={isAsc}
              onChange={handleIsAscChange}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProcessBoardToolbar;
