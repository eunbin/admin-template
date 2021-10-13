import { AxiosInstance } from 'axios';

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
