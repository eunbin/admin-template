import { BoardColumn, BoardProps } from 'types/kanban';
import {
  ProcessBoardCardItem,
  ProcessRealtimeItem,
  ProcessSnapshotItem,
} from 'types/process';

interface SortOption {
  sortField: keyof ProcessSnapshotItem;
  isAsc: boolean;
}

export const sortColumns = (
  board: BoardProps<ProcessBoardCardItem>,
  sortOption: SortOption
): BoardColumn<ProcessBoardCardItem>[] => {
  const { sortField, isAsc } = sortOption;
  return board.columns.map((column) => {
    const sorted = column.cards.sort(
      (a, b) =>
        a[sortField].toString().localeCompare(b[sortField].toString()) ||
        new Date(b['req_time']).getTime() - new Date(a['req_time']).getTime()
    );
    return {
      ...column,
      cards: isAsc ? sorted : sorted.reverse(),
    };
  });
};

export const addCardBySortOption = async (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  process: ProcessRealtimeItem,
  sortOption: SortOption
): Promise<BoardProps<ProcessBoardCardItem> | null> => {
  const newBoard = await addCard(board, columnId, process);
  if (!newBoard) {
    return null;
  }
  const sortedColumns = sortColumns(newBoard, sortOption);
  return {
    columns: sortedColumns,
  };
};

export const addCard = async (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  process: ProcessRealtimeItem
): Promise<BoardProps<ProcessBoardCardItem> | null> => {
  const inColumn = board.columns.find((column) => column.id === columnId);

  if (!inColumn) {
    return null;
  }

  const { addCard } = await import('@lourenci/react-kanban');

  const newBoard = addCard(
    board,
    inColumn,
    {
      ...process,
      id: process.item_id,
      initialBlink: true,
    },
    { on: 'top' }
  );
  return newBoard;
};

export const moveCardBySortOption = async (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  cardId: string,
  sortOption: SortOption
): Promise<BoardProps<ProcessBoardCardItem> | null> => {
  const newBoard = await moveCard(board, columnId, cardId);
  if (!newBoard) {
    return null;
  }
  const sortedColumns = sortColumns(newBoard, sortOption);
  return {
    columns: sortedColumns,
  };
};

export const moveCard = async (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  cardId: string
): Promise<BoardProps<ProcessBoardCardItem> | null> => {
  const { columns } = board;

  let position: {
    fromPosition: number;
    fromColumnId: number;
    toPosition: number;
    toColumnId: number;
  } | null = null;

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

  const { moveCard } = await import('@lourenci/react-kanban');

  if (!position) {
    return null;
  }

  const { toColumnId, fromColumnId, fromPosition, toPosition } = position;

  const newBoard = moveCard(
    {
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) => ({
          ...card,
          // XXX: 이동시킬 카드에만 적용
          initialBlink: true,
        })),
      })),
    },
    {
      fromPosition,
      fromColumnId,
    },
    {
      toPosition,
      toColumnId,
    }
  );

  return newBoard;
};

export const removeCard = async (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  cardId: string
): Promise<BoardProps<ProcessBoardCardItem> | null> => {
  const { columns } = board;

  const targetColumn = columns.find((column) => column.id === columnId);
  const targetCard = targetColumn?.cards.find((card) => card.id === cardId);

  const { removeCard } = await import('@lourenci/react-kanban');

  if (targetColumn && targetCard) {
    const newBoard = removeCard(board, targetColumn, targetCard);
    return newBoard;
  } else {
    return null;
  }
};
