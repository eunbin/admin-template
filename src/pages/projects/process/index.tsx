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
  moveCard,
  removeCard,
  sortColumns,
} from 'utils/kanban';
import { Button, Space } from 'antd';
import { setCookie } from 'utils/client-cookie';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { useModal } from 'contexts/ModalProvider';
import useNotification from 'hooks/useNotification';
import { useAppDataDispatch, useAppDataState } from 'contexts/AppDataProvider';
import { isJsonString } from 'utils/json';

interface Props {
  cookies: Record<string, any>;
}

function ProcessPage({ cookies }: Props) {
  const { closeModal } = useModal();
  const { showNotification } = useNotification();

  const { siteId, clientId, user } = useAppDataState();
  const dispatch = useAppDataDispatch();

  useEffect(() => {
    dispatch({ type: 'SET_SITE_ID', siteId: 1 });
    dispatch({ type: 'SET_CLIENT_ID', clientId: '1' });
    dispatch({ type: 'SET_USER', user: { id: 1 } });
  }, [dispatch]);

  const [board, setBoard] = useState<BoardProps<ProcessBoardCardItem>>({
    columns: [],
  });
  const [sortField, setSortField] = useState<SortFieldType>(
    cookies['sortField']
  );
  const [isAsc, setIsAsc] = useState<boolean>(cookies['sortIsAsc'] === 'true');

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

  const { message } = useWebSocket(siteId, clientId, {
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
      switch (content.type) {
        case 'New':
          setBoard(
            await addCardBySortOption(board, content.process_id, content, {
              sortField,
              isAsc,
            })
          );
          break;
        case 'Update':
          setBoard(await moveCard(board, content.process_id, content.item_id));
          break;
        case 'Delete':
          setBoard(
            await removeCard(board, content.process_id, content.item_id)
          );
          break;
        default:
          break;
      }
    },
  });

  const [isMaxHeight, setIsMaxHeight] = useState<boolean>(
    cookies['isMaxHeight'] === 'true'
  );

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
        <Button
          onClick={async () => {
            const process: ProcessRealtime = {
              type: 'Scan',
              content: {
                type: 'New',
                site_id: 1,
                process_id: 1,
                item_id: '9999',
                item_name: 'uuid 009999',
                client_name: '고객사 2',
                patient_name: '홍길동 9999',
                client_note: '고객 요청사항 9999',
                req_time: '2021-10-16 09:31:01',
                start_time: '2021-10-22 12:49:25',
                deadline: '44507',
              },
              valid_until: '2021-10-23 12:49:24.626511',
            };
            setBoard(
              await addCardBySortOption(board, 2, process.content, {
                sortField,
                isAsc,
              })
            );
          }}
        >
          add
        </Button>
        <Button
          onClick={async () => {
            const process: ProcessRealtime = {
              type: 'Scan',
              content: {
                type: 'Update',
                site_id: 1,
                process_id: 3,
                item_id: '9999',
                start_time: '2021-10-22 12:49:24.925013',
              },
              valid_until: '2021-10-23 12:49:24.939781',
            };
            setBoard(
              await moveCard(
                board,
                process.content.process_id,
                process.content.item_id
              )
            );
          }}
        >
          update
        </Button>
        <Button
          onClick={async () => {
            const process: ProcessRealtime = {
              type: 'Scan',
              content: {
                type: 'Delete',
                site_id: 1,
                process_id: 3,
                item_id: '9999',
                start_time: null,
              },
              valid_until: '2021-10-23 12:49:19.581914',
            };
            setBoard(
              await removeCard(
                board,
                process.content.process_id,
                process.content.item_id
              )
            );
          }}
        >
          remove
        </Button>
        <Space />
        <Button>Start Test</Button>
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
