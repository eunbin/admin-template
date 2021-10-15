import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PageLayout from 'layouts/PageLayout';
import '@asseinfo/react-kanban/dist/styles.css';
import ProcessCard from 'pages-components/projects/process/ProcessCard';
import { useModal } from 'contexts/ModalProvider';
import useConfirm from 'hooks/useConfirm';
import useNotification from 'hooks/useNotification';
import { useQuery } from 'react-query';
import API from 'api';
import {
  ProcessSnapshotItem,
  ProcessSnapshot,
  ProcessRealtime,
  ProcessRealtimeItem,
} from 'types/process';
import dynamic from 'next/dynamic';
import useWebSocket from 'hooks/useWebSocket';
import useVisibilityChange from 'hooks/useVisibilityChange';
import { BoardProps } from 'types/kanban';
import { Button } from 'antd';
import { logger } from 'react-query/types/react/logger';

const Board = dynamic(() => import('@lourenci/react-kanban'), {
  ssr: false,
});

const siteId = '1';
const clientId = '1';

function ProcessPage() {
  const { showModal, closeModal } = useModal();
  const { showConfirm } = useConfirm();
  const { showNotification } = useNotification();

  const { data, refetch, isLoading, error } = useQuery(
    'processSnapshot',
    () => API.mis.process.getProcessSnapshot(siteId),
    {
      onSuccess: (data: ProcessSnapshot[]) => {
        const newBoard: BoardProps<ProcessSnapshotItem> = {
          // @ts-ignore
          columns:
            data?.map((process) => ({
              ...process,
              id: process.process_id, // required, react-kanban column id
              title: process.process_name, // required, react-kanban column name
              cards: process.item_list,
            })) || [],
        };
        setBoard(newBoard);
      },
    }
  );

  const { message, connect, disconnect } = useWebSocket(siteId, clientId, {
    onConnect: () => {
      refetch();
    },
  });
  useVisibilityChange({ onHide: disconnect, onShow: connect });

  const [board, setBoard] = useState<BoardProps<ProcessSnapshotItem>>({
    columns: [],
  });

  const testId = useRef<string | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }

    try {
      const data: ProcessRealtime = JSON.parse(message);
      if (data?.type !== 'Scan') {
        return;
      }

      const { content } = data;
      switch (content.type) {
        case 'New':
          console.log('New: ', content);
          addCard(content.process_id, content);
          break;
        case 'Update':
          console.log('Update: ', content);
          break;
        case 'Delete':
          console.log('Delete: ', content);
          break;
        default:
          break;
      }
    } catch (e) {
      // console.error(e);
    }
  }, [message]);

  const addCard = (columnId: number, process: ProcessRealtimeItem) => {
    const inColumn = board.columns.find(
      (column) => column.process_id === columnId
    );

    if (!inColumn) {
      return;
    }

    const now = new Date();

    import('@lourenci/react-kanban').then(({ addCard }) => {
      const newBoard = addCard(
        board,
        inColumn,
        {
          ...process,
          id: process.item_id,
        },
        { on: 'top' }
      );
      setBoard(newBoard);
    });
  };

  const moveCard = (cardId: string, columnId: number) => {
    const { columns } = board;

    let position: {
      fromPosition: number;
      fromColumnId: number;
      toPosition: number;
      toColumnId: number;
    } = null;

    columns.forEach((column, columnIndex) => {
      column.cards.forEach((card, cardIndex) => {
        if (card.id === cardId) {
          position = {
            fromPosition: cardIndex,
            fromColumnId: columnIndex + 1,
            toPosition: 0,
            toColumnId: columnId,
          };
        }
      });
    });

    if (!position) {
      return;
    }

    import('@lourenci/react-kanban').then(({ moveCard }) => {
      const { toColumnId, fromColumnId, fromPosition, toPosition } = position;

      const newBoard = moveCard(
        board,
        {
          fromPosition,
          fromColumnId,
        },
        {
          toPosition,
          toColumnId,
        }
      );
      setBoard(newBoard);
    });
  };

  const handleAdd = () => {
    const date = new Date();
    testId.current = date.toISOString();

    const data: ProcessRealtimeItem = {
      client_name: 'client_name',
      client_note: 'client_note',
      deadline: '2021-10-05T11:14:32',
      item_id: testId.current,
      item_name: 'item_name',
      patient_name: testId.current,
      process_id: 1,
      req_time: '2021-10-05T11:14:32',
      site_id: 1,
      start_time: undefined,
      type: 'New',
    };
    addCard(data.process_id, data);
  };

  const handleMove = () => {
    if (!testId.current) {
      return;
    }

    const data: ProcessRealtimeItem = {
      item_id: testId.current,
      process_id: 2,
      site_id: 1,
      type: 'Update',
    };
    moveCard(data.item_id, data.process_id);
  };

  const handleDetailClick = (process: ProcessSnapshotItem) => () => {
    import('pages-components/projects/process/ProcessDetailModal').then(
      ({ default: Component }) => {
        showModal({
          component: Component,
          modalProps: {
            data: process,
            onOk: (process: ProcessSnapshotItem) => {
              // TODO: 삭제 api
              closeModal();
              showNotification({
                description: `${process.patient_name} (${process.client_name}) 가 삭제되었습니다.`,
              });
            },
          },
        });
      }
    );
  };

  const handleDeleteClick = (process: ProcessSnapshotItem) => () => {
    showConfirm({
      content: `${process.patient_name} (${process.client_name}) 를 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: () => {
        showNotification({
          description: `${process.patient_name} (${process.client_name}) 가 삭제되었습니다.`,
        });
      },
    });
  };

  const handleEndClick = (process: ProcessSnapshotItem) => () => {
    showConfirm({
      content: `${process.patient_name} (${process.client_name}) 를 종료하시겠습니까?`,
      okText: '종료',
      cancelText: '취소',
      onOk: () => {
        showNotification({
          description: `${process.patient_name} (${process.client_name}) 가 종료되었습니다.`,
        });
      },
    });
  };

  return (
    <PageLayout>
      <>
        <Button onClick={handleAdd}>add</Button>
        <Button onClick={handleMove}>move</Button>
        <Board
          renderColumnHeader={(column) => {
            const { title, bg_color } = column;
            return (
              <div css={{ background: bg_color }}>
                <h3 css={{ textAlign: 'center' }}>{title}</h3>
              </div>
            );
          }}
          renderCard={(process: ProcessSnapshotItem) => (
            <ProcessCard
              key={process.id}
              data={process}
              initialBlink={false}
              onDetailClick={handleDetailClick(process)}
              onDeleteClick={handleDeleteClick(process)}
              onEndClick={handleEndClick(process)}
            />
          )}
          disableCardDrag
          disableColumnDrag
        >
          {board}
        </Board>
      </>
    </PageLayout>
  );
}

export default ProcessPage;
