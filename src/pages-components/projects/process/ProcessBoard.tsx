import React from 'react';
import { ProcessBoardCardItem, ProcessSnapshotItem } from 'types/process';
import ProcessCard from 'pages-components/projects/process/ProcessCard';
import dynamic from 'next/dynamic';
import '@asseinfo/react-kanban/dist/styles.css';
import { BoardProps } from 'types/kanban';

const Board = dynamic(() => import('@lourenci/react-kanban'), {
  ssr: false,
});

interface ProcessBoardProps {
  board: BoardProps<ProcessBoardCardItem>;
  isMaxHeight: boolean;
}

function ProcessBoard({ board, isMaxHeight }: ProcessBoardProps) {
  return (
    <Board
      /* @ts-ignore*/
      renderColumnHeader={(column: any) => (
        <div css={{ background: column.bg_color }}>
          <h3 css={{ textAlign: 'center' }}>{column.title}</h3>
        </div>
      )}
      renderCard={(process: ProcessBoardCardItem) => (
        <ProcessCard
          key={process.id}
          process={process}
          initialBlink={process.initialBlink}
          fullContent={isMaxHeight}
        />
      )}
      disableCardDrag
      disableColumnDrag
    >
      {board}
    </Board>
  );
}

export default ProcessBoard;
