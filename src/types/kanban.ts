export interface BoardProps<T> {
  columns: BoardColumn<T>[];
}

export interface BoardColumn<T> {
  id: string | number;
  title: string;
  cards: T[];
  [key: string]: any;
}
