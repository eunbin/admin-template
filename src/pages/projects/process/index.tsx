import React, { useEffect, useState } from 'react';
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

const Board = dynamic(() => import('@lourenci/react-kanban'), {
  ssr: false,
});

const siteId = '1';
const clientId = '1';

function ProcessPage() {
  const { showModal, closeModal } = useModal();
  const { showConfirm } = useConfirm();
  const { showNotification } = useNotification();

  const { message, connect, disconnect } = useWebSocket(siteId, clientId);
  // useVisibilityChange({ onHide: disconnect, onShow: connect });
  useVisibilityChange();

  const [board, setBoard] = useState<BoardProps>({
    columns: [],
  });

  const { data, isLoading, error } = useQuery(
    'processSnapshot',
    () => API.mis.process.getProcessSnapshot(siteId),
    {
      onSuccess: (data: ProcessSnapshot[]) => {
        const newBoard = {
          columns:
            data?.map((process) => ({
              ...process,
              cards: process.item_list,
            })) || [],
        };
        console.log('newBoard: ', newBoard.columns);
        setBoard(newBoard);
      },
    }
  );

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
          addCardItem(content.process_id, content);
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

  const addCardItem = (columnId: number, process: ProcessRealtimeItem) => {
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
          // ...process,
          id: now.getTime(),
        },
        { on: 'top' }
      );
      setBoard(newBoard);
    });
  };

  useEffect(() => {
    console.debug('changed: ', board);
  }, [board]);

  useEffect(() => {
    const columns = document.getElementsByClassName('react-kanban-column');

    Array.prototype.forEach.call(columns, (el, index) => {
      // console.log(board.columns[index]?.bg_color);
      el.style.background = board.columns[index]?.bg_color;
    });
  }, [board]);

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
      <Board
        renderColumnHeader={({ title }) => (
          <h3 css={{ textAlign: 'center' }}>{title}</h3>
        )}
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
    </PageLayout>
  );
}

export default ProcessPage;
