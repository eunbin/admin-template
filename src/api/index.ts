import axios, { AxiosRequestConfig } from 'axios';
import appConfig from 'config/app-config.local';
import winnerApi from 'api/agGridApi/winner';
import userAPI from 'api/mockApi/user';
import todoAPI from 'api/mockApi/todo';
import processAPI from 'api/misApi/process';

const {
  agGridApi: agGridApiConfig,
  mockApi: mockApiConfig,
  misApi: misApiConfig,
} = appConfig.services;

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
const misApiInstance = createInstance({
  baseURL: misApiConfig.url,
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ7XCJmYl9pZFwiOiBcIjEyMzQtMTIzNC0xMjMwMDAxXCIsIFwiZW1haWxcIjogXCJ0ZXN0MDAwMUBnbWFpbC5jb21cIiwgXCJpc3N1ZWRfYXRcIjogXCIyMDIxLTEwLTEzIDEwOjMwOjQ1Ljg4MTgwMVwiLCBcImRlbHRhXCI6IDEwODAwLCBcImV4cGlyZV9hdFwiOiBcIjIwMjEtMTAtMjAgMjI6MzA6NDUuODgxODAxXCJ9IiwiZXhwIjoxNjM0NzY5MDQ1fQ.BRxfkm_0W0ofxJ6-dxy593mtraR5NPFk911Ny50b7M4',
  },
});

const API = {
  agGrid: {
    winners: winnerApi(agGridApiInstance),
  },
  mock: {
    users: userAPI(mockApiInstance),
    todos: todoAPI(mockApiInstance),
  },
  mis: {
    process: processAPI(misApiInstance),
  },
};

export default API;
