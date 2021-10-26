export interface DeleteItemRequest {
  site_id: number;
  user_id: number;
  process_id: number;
  item_id: string;
}
export type DeleteItemResponse = boolean;

export type CloseProcessRequest = DeleteItemRequest;

export type CloseProcessResponse = boolean;
