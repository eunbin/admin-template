import { AxiosInstance } from 'axios';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

type TodoDetailRequest = string;

const todoAPI = (axios: AxiosInstance) => ({
  list: async () => {
    try {
      const { data } = await axios.get('/todos');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  detail: async (id: TodoDetailRequest) => {
    try {
      const { data } = await axios.get('/todos', {
        params: {
          id,
        },
      });
      return data;
    } catch (e) {
      console.error(e);
    }
  },
});

export default todoAPI;
