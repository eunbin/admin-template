interface Process {
  id: number;
  name: string;
  use_yn: string;
  del_yn: string;
  create_time: string;
  update_time: string;
  site_id: number;
  equipment_uuid: string;
  scanner_uuid: string;
  sort_order: number;
  bg_color: string;
}

interface ProcessIn {
  id: number;
  name: string;
  site_id: number;
  equipment_uuid: string;
  scanner_uuid: string;
  sort_order: number;
  bg_color: string;
}

export interface ProcessSnapshot {
  process_id: number;
  process_name: string;
  bg_color: string;
  item_list: ProcessSnapshotItem[];
}

export interface ProcessSnapshotItem {
  id: string;
  name: string;
  client_name: string;
  patient_name: string;
  client_note: string;
  req_time: string;
  start_time: string;
  deadline: string;
}

export type ProcessRealtimeType = 'New' | 'Update' | 'Delete';

export interface ProcessRealtimeItem {
  type: ProcessRealtimeType;
  site_id: number;
  process_id: number; // column id
  item_id: string; // card id
  item_name?: string;
  client_name?: string;
  patient_name?: string;
  client_note?: string;
  req_time?: string;
  start_time?: string | null;
  deadline?: string;
}

export interface ProcessRealtime {
  type: 'Scan';
  content: ProcessRealtimeItem;
  valid_until: string;
}
