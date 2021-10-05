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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ7XCJmYl9pZFwiOiBcIjEyMzQtMTIzNC0xMjMwMDAyXCIsIFwiZW1haWxcIjogXCJ0ZXN0MDAwMkBnbWFpbC5jb21cIiwgXCJpc3N1ZWRfYXRcIjogXCIyMDIxLTEwLTA1IDEyOjM2OjI1LjM1NDkzMlwiLCBcImRlbHRhXCI6IDEwODAwLCBcImV4cGlyZV9hdFwiOiBcIjIwMjEtMTAtMTMgMDA6MzY6MjUuMzU0OTMyXCJ9IiwiZXhwIjoxNjM0MDg1Mzg1fQ.u5zBD0Fd2l9rVAtp04ppGWthc6wZ8XcqxHWWkpBU9ks',
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
