import { AxiosInstance } from 'axios';
import { CloseProcessRequest, DeleteItemRequest } from 'types/socket';

const socketAPI = (axios: AxiosInstance) => ({
  deleteItem: async (payload: DeleteItemRequest) => {
    try {
      const { data } = await axios.put('/item/delete', payload);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  closeProcess: async (payload: CloseProcessRequest) => {
    try {
      const { data } = await axios.put('/process/close', payload);
      return data;
    } catch (e) {
      console.error(e);
    }
  },
});

export default socketAPI;
