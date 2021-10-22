import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
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
import ProcessBoardToolbar from 'pages-components/projects/process/ProcessBoardToolbar';
import ProcessBoard from 'pages-components/projects/process/ProcessBoard';
import { addCard, moveCard, removeCard, sortColumns } from 'utils/kanban';
import { Button } from 'antd';
import { setCookie } from 'utils/client-cookie';
import { GetServerSideProps } from 'next';
import nookies from 'nookies';

const siteId = '1';
const clientId = '1';

interface Props {
  cookies: any;
}

function ProcessPage({ cookies }: Props) {
  const [board, setBoard] = useState<BoardProps<ProcessBoardCardItem>>({
    columns: [],
  });

  const { refetch } = useQuery(
    'processSnapshot',
    () => API.mis.process.getProcessSnapshot(siteId),
    {
      onSuccess: (data: ProcessSnapshot[]) => {
        const newBoard: BoardProps<ProcessBoardCardItem> = {
          // @ts-ignore
          columns:
            data?.map(({ process_id, process_name, item_list, ...rest }) => ({
              ...rest,
              id: process_id, // required, react-kanban column id
              title: process_name, // required, react-kanban column name
              cards: item_list,
              initialBlink: false,
            })) || [],
        };
        setBoard(newBoard);
      },
    }
  );

  const { message } = useWebSocket(siteId, clientId, {
    enabled: true,
    visibilityChange: true,
    onConnect: () => {
      refetch();
    },
    onMessage: async (message: string) => {
      if (!message) {
        return;
      }
      const data: ProcessRealtime = JSON.parse(message);
      if (data?.type !== 'Scan') {
        return;
      }
      const { content } = data;
      switch (content.type) {
        case 'New':
          setBoard(await addCard(board, content.process_id, content));
          break;
        case 'Update':
          setBoard(await moveCard(board, content.process_id, content.item_id));
          break;
        case 'Delete':
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
    (field: keyof ProcessSnapshotItem, isAsc: boolean) => {
      const newBoard: BoardProps<ProcessBoardCardItem> = {
        columns: sortColumns(board, field, isAsc),
      };
      setBoard(newBoard);
      setCookie('sortField', field);
      setCookie('sortIsAsc', isAsc);
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
            setBoard(await addCard(board, 2, process.content));
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
        <ProcessBoardToolbar
          initialIsMaxHeight={isMaxHeight}
          initialSortField={cookies['sortField']}
          initialIsAsc={cookies['sortIsAsc'] === 'true'}
          onCardHeightChange={handleCardHeightChange}
          onSortChange={handleSortChange}
        />
        <ProcessBoard board={board} isMaxHeight={isMaxHeight} />
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
