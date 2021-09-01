import { AxiosInstance } from 'axios';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

type UserDetailRequest = string;

const userAPI = (axios: AxiosInstance) => ({
  list: async () => {
    try {
      const { data } = await axios.get('/users');
      return data;
    } catch (e) {
      console.error(e);
    }
  },
  detail: async (id: UserDetailRequest) => {
    try {
      const { data } = await axios.get('/users', {
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

export default userAPI;
