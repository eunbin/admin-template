import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import API from 'api';
import {
  ProcessSnapshotItem,
  ProcessSnapshot,
  ProcessRealtime,
  ProcessBoardCardItem,
} from 'types/process';
import { BoardProps } from 'types/kanban';
import useWebSocket from 'hooks/useWebSocket';
import PageLayout from 'layouts/PageLayout';
import ProcessBoardToolbar, {
  SortFieldType,
} from 'pages-components/projects/process/ProcessBoardToolbar';
import ProcessBoard from 'pages-components/projects/process/ProcessBoard';
import {
  addCardBySortOption,
  moveCardBySortOption,
  removeCard,
  sortColumns,
} from 'utils/kanban';
import { Button, Space } from 'antd';
import { getCookie, setCookie } from 'utils/client-cookie';
import { GetServerSideProps } from 'next';
import nookies, { parseCookies } from 'nookies';
import { useModal } from 'contexts/ModalProvider';
import useNotification from 'hooks/useNotification';
import { useAppDataState } from 'contexts/AppDataProvider';
import { isJsonString } from 'utils/json';

interface Props {
  cookies: Record<string, any>;
}

function ProcessPage({ cookies }: Props) {
  const { showNotification } = useNotification();
  const { closeModal } = useModal();

  const { siteId, clientId, user } = useAppDataState();

  const [board, setBoard] = useState<BoardProps<ProcessBoardCardItem>>({
    columns: [],
  });

  const [isMaxHeight, setIsMaxHeight] = useState<boolean>(
    cookies['isMaxHeight']
      ? cookies['isMaxHeight'] === 'true'
      : getCookie('isMaxHeight')
      ? getCookie('isMaxHeight') === 'true'
      : true
  );
  const [sortField, setSortField] = useState<SortFieldType>(
    cookies['sortField']
      ? cookies['sortField']
      : getCookie('sortField')
      ? getCookie('sortField')
      : 'client_name'
  );
  const [isAsc, setIsAsc] = useState<boolean>(
    cookies['sortIsAsc']
      ? cookies['sortIsAsc'] === 'true'
      : getCookie('sortIsAsc')
      ? getCookie('sortIsAsc') === 'true'
      : true
  );

  const { refetch } = useQuery(
    'processSnapshot',
    () => !!siteId && API.mis.process.getProcessSnapshot(siteId),
    {
      onSuccess: (data: ProcessSnapshot[]) => {
        if (!data) {
          return;
        }
        const newBoard: BoardProps<ProcessBoardCardItem> = {
          // @ts-ignore
          columns:
            data?.map(({ process_id, process_name, item_list, ...rest }) => ({
              ...rest,
              id: process_id, // required, react-kanban column id
              title: process_name, // required, react-kanban column name
              cards: item_list.map((item) => ({ ...item, process_id })),
              initialBlink: false,
            })) || [],
        };
        setBoard(newBoard);
      },
    }
  );

  const deleteProcess = useMutation(
    (item: ProcessSnapshotItem) => {
      return API.socket.socket.deleteItem({
        process_id: item.process_id,
        item_id: item.id,
        site_id: siteId,
        user_id: user.id,
      });
    },
    {
      onSuccess: (data: boolean, variables, context) => {
        closeModal();
        showNotification({
          description: '정상적으로 삭제되었습니다.',
        });
        refetch();
      },
      onError: (error, variables, context) => {
        console.error(error);
        showNotification({
          description: '삭제에 실패했습니다.',
        });
      },
    }
  );

  const closeProcess = useMutation(
    (item: ProcessSnapshotItem) => {
      return API.socket.socket.closeProcess({
        process_id: item.process_id,
        item_id: item.id,
        site_id: siteId,
        user_id: user.id,
      });
    },
    {
      onSuccess: (data: boolean, variables, context) => {
        closeModal();
        showNotification({
          description: '정상적으로 종료되었습니다.',
        });
        refetch();
      },
      onError: (error, variables, context) => {
        console.error(error);
        showNotification({
          description: '종료에 실패했습니다.',
        });
      },
    }
  );

  useWebSocket(siteId, clientId, {
    enabled: !!siteId,
    visibilityChange: true,
    onConnect: () => {
      refetch();
    },
    onMessage: async (message: string) => {
      if (!message || !isJsonString(message)) {
        return;
      }
      const data: ProcessRealtime = JSON.parse(message);
      if (data.type !== 'Scan') {
        return;
      }
      const { content } = data;

      const columnId = content.process_id;
      const cardId = content.item_id;

      const { columns } = board;
      if (!columns || columns.length < 1) {
        return;
      }

      switch (content.type) {
        case 'New':
          const addedBoard = await addCardBySortOption(
            board,
            columnId,
            content,
            {
              sortField,
              isAsc,
            }
          );
          if (addedBoard) {
            setBoard(addedBoard);
          }
          break;
        case 'Update':
          const updatedBoard = await moveCardBySortOption(
            board,
            columnId,
            cardId,
            {
              sortField,
              isAsc,
            }
          );
          if (updatedBoard) {
            setBoard(updatedBoard);
          }
          break;
        case 'Delete':
          const removedBoard = await removeCard(board, columnId, cardId);
          if (removedBoard) {
            setBoard(removedBoard);
          }
          break;
        default:
          break;
      }
    },
  });

  const handleCardHeightChange = useCallback((isMaxHeight: boolean) => {
    setIsMaxHeight(isMaxHeight);
    setCookie('isMaxHeight', isMaxHeight);
  }, []);

  const handleSortChange = useCallback(
    (field: SortFieldType, isAsc: boolean) => {
      setSortField(field);
      setIsAsc(isAsc);
      setCookie('sortField', field);
      setCookie('sortIsAsc', isAsc);

      const newBoard: BoardProps<ProcessBoardCardItem> = {
        columns: sortColumns(board, { sortField: field, isAsc }),
      };
      setBoard(newBoard);
    },
    [board]
  );

  return (
    <PageLayout>
      <>
        <ProcessBoardToolbar
          isMaxHeight={isMaxHeight}
          sortField={sortField}
          isAsc={isAsc}
          onCardHeightChange={handleCardHeightChange}
          onSortChange={handleSortChange}
        />
        <ProcessBoard
          board={board}
          isMaxHeight={isMaxHeight}
          onDelete={(item: ProcessSnapshotItem) => deleteProcess.mutate(item)}
          onProcessClose={(item: ProcessSnapshotItem) =>
            closeProcess.mutate(item)
          }
        />
      </>
    </PageLayout>
  );
}

export default ProcessPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let cookies = nookies.get(ctx);

  return {
    props: {
      server: true,
      cookies,
    },
  };
};
