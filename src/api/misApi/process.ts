import { AxiosInstance } from 'axios';

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

export interface ProcessStatOut {
  process_id: number;
  process_name: string;
  bg_color: string;
  item_list: ProcessStatItem[];
}

export interface ProcessStatItem {
  id: string;
  name: string;
  client_name: string;
  patient_name: string;
  client_note: string;
  req_time: string;
  start_time: string;
  deadline: string;
}

const processAPI = (axios: AxiosInstance) => ({
  getProcess: async () => {
    try {
      const { data } = await axios.get('/process/');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  createProcess: async () => {
    try {
      const { data } = await axios.post('/process/');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  updateProcess: async () => {
    try {
      const { data } = await axios.put('/process/');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  deleteProcess: async () => {
    try {
      const { data } = await axios.delete('/process/');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  getProcessBySiteId: async (siteId: string) => {
    try {
      const { data } = await axios.get(`/process/site/${siteId}`);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  getProcessById: async (id: string) => {
    try {
      const { data } = await axios.get(`/process/${id}`);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  deleteProcessById: async (id: string) => {
    try {
      const { data } = await axios.delete(`/process/${id}`);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  getProcessSnapshot: async (siteId: string) => {
    try {
      const { data } = await axios.get(`/process/snapshot/${siteId}`);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
});

export default processAPI;
