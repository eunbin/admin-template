import axios, { AxiosRequestConfig } from 'axios';
import appConfig from 'config/app-config.local';
import winnerApi from 'api/agGridApi/winner';
import userAPI from 'api/mockApi/user';
import todoAPI from 'api/mockApi/todo';

const { agGridApi: agGridApiConfig, mockApi: mockApiConfig } =
  appConfig.services;

const createInstance = (options: AxiosRequestConfig) => {
  return axios.create({
    ...options,
  });
};

const agGridApiInstance = createInstance({
  baseURL: agGridApiConfig.url,
});
const mockApiInstance = createInstance({
  baseURL: mockApiConfig.url,
});

const API = {
  agGrid: {
    winners: winnerApi(agGridApiInstance),
  },
  mock: {
    users: userAPI(mockApiInstance),
    todos: todoAPI(mockApiInstance),
  },
};

export default API;
