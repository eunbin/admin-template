import { BoardProps } from 'types/kanban';
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
): any => {
  const { sortField, isAsc } = sortOption;
  return board.columns.map((column) => {
    const sorted = column.cards.sort((a, b) =>
      a[sortField].toString().localeCompare(b[sortField].toString())
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
): Promise<BoardProps<ProcessBoardCardItem>> => {
  const newBoard = await addCard(board, columnId, process);
  const sortedColumns = sortColumns(newBoard, sortOption);
  return {
    columns: sortedColumns,
  };
};

export const addCard = (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  process: ProcessRealtimeItem
): Promise<BoardProps<ProcessBoardCardItem>> => {
  return new Promise((resolve, reject) => {
    const inColumn = board.columns.find((column) => column.id === columnId);

    if (!inColumn) {
      reject();
      return;
    }

    import('@lourenci/react-kanban').then(({ addCard }) => {
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
      resolve(newBoard);
    });
  });
};

export const moveCard = (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  cardId: string
): Promise<BoardProps<ProcessBoardCardItem>> => {
  return new Promise((resolve, reject) => {
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

    import('@lourenci/react-kanban').then(({ moveCard }) => {
      if (!position) {
        reject();
        return;
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
      resolve(newBoard);
    });
  });
};

export const removeCard = (
  board: BoardProps<ProcessBoardCardItem>,
  columnId: number,
  cardId: string
): Promise<BoardProps<ProcessBoardCardItem>> => {
  return new Promise((resolve, reject) => {
    const { columns } = board;

    const targetColumn = columns.find((column) => column.id === columnId);
    const targetCard = targetColumn?.cards.find((card) => card.id === cardId);

    import('@lourenci/react-kanban').then(({ removeCard }) => {
      if (targetColumn && targetCard) {
        const newBoard = removeCard(board, targetColumn, targetCard);
        resolve(newBoard);
      }
    });
  });
};
