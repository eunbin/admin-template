import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PageLayout from 'layouts/PageLayout';
import '@asseinfo/react-kanban/dist/styles.css';
import ProcessCard from 'pages-components/projects/process/ProcessCard';
import { useModal } from 'contexts/ModalProvider';
import useConfirm from 'hooks/useConfirm';
import useNotification from 'hooks/useNotification';
import { useQuery } from 'react-query';
import API from 'api';
import { ProcessStatItem, ProcessStatOut } from 'api/misApi/process';
import dynamic from 'next/dynamic';
import useWebSocket from 'hooks/useWebSocket';

const Board = dynamic(() => import('@lourenci/react-kanban'), { ssr: false });

const siteId = '1';
const clientId = '1';

interface BoardProps<T> {
  columns: T;
}

function ProcessPage() {
  const { showModal, closeModal } = useModal();
  const { showConfirm } = useConfirm();
  const { showNotification } = useNotification();

  const { message } = useWebSocket(siteId, clientId);

  const [board, setBoard] = useState<BoardProps<ProcessStatOut[]>>({
    columns: [],
  });

  const { data, isLoading, error } = useQuery(
    'processSnapshot',
    () => API.mis.process.getProcessSnapshot(siteId),
    {
      onSuccess: (data: ProcessStatOut[]) => {
        setBoard({
          columns:
            data?.map((process) => ({
              ...process,
              title: process.process_name,
              cards: process.item_list,
            })) || [],
        });
      },
    }
  );

  useEffect(() => {
    const columns = document.getElementsByClassName('react-kanban-column');

    Array.prototype.forEach.call(columns, (el, index) => {
      console.log(board.columns[index]?.bg_color);
      el.style.background = board.columns[index]?.bg_color;
    });
  }, [board]);

  const handleDetailClick = (process: ProcessStatItem) => () => {
    import('pages-components/projects/process/ProcessDetailModal').then(
      ({ default: Component }) => {
        showModal({
          component: Component,
          modalProps: {
            data: process,
            onOk: (process: ProcessStatItem) => {
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

  const handleDeleteClick = (process: ProcessStatItem) => () => {
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

  return (
    <PageLayout>
      <Board
        renderColumnHeader={({ title }) => (
          <h3 css={{ textAlign: 'center' }}>{title}</h3>
        )}
        renderCard={(process: ProcessStatItem) => (
          <ProcessCard
            key={process.id}
            data={process}
            initialBlink={false}
            onDetailClick={handleDetailClick(process)}
            onDeleteClick={handleDeleteClick(process)}
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
