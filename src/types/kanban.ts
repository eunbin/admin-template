export interface BoardProps {
  columns: BoardColumn[];
}

export interface BoardColumn {
  [key: string]: any;
  cards: unknown[];
}
