import { AxiosInstance } from 'axios';

const winnerApi = (axios: AxiosInstance) => ({
  list: async () => {
    try {
      const { data } = await axios.get('/example-assets/olympic-winners.json');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
});

export default winnerApi;
