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
  onDelete: (item: ProcessSnapshotItem) => void;
  onProcessClose: (item: ProcessSnapshotItem) => void;
}

function ProcessBoard({
  board,
  isMaxHeight,
  onDelete,
  onProcessClose,
}: ProcessBoardProps) {
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
          item={process}
          initialBlink={process.initialBlink}
          fullContent={isMaxHeight}
          onDelete={onDelete}
          onProcessClose={onProcessClose}
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
