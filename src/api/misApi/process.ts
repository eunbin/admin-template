import { AxiosInstance } from 'axios';
import { ProcessMemoRequest } from 'types/process';

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
  getProcessDetail: async (siteId: string, itemId: string) => {
    try {
      const { data } = await axios.get(`/process/history/${siteId}/${itemId}`);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  addMemo: async (payload: ProcessMemoRequest) => {
    try {
      const { data } = await axios.put('/process/memo', payload);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
});

export default processAPI;
