import axios, { AxiosRequestConfig } from 'axios';
import appConfig from 'config/app-config.local';
import winnerApi from 'api/agGridApi/winner';
import userAPI from 'api/mockApi/user';
import todoAPI from 'api/mockApi/todo';
import processAPI from 'api/misApi/process';
import socketAPI from 'api/socketApi/socket';

const {
  agGridApi: agGridApiConfig,
  mockApi: mockApiConfig,
  misApi: misApiConfig,
  socketApi: socketApiConfig,
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

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ7XCJmYl9pZFwiOiBcIjEyMzQtMTIzNC0xMjMwMDAxXCIsIFwiZW1haWxcIjogXCJ0ZXN0MDAwMUBnbWFpbC5jb21cIiwgXCJpc3N1ZWRfYXRcIjogXCIyMDIxLTEwLTIyIDExOjQ1OjMyLjk4NDA1NFwiLCBcImRlbHRhXCI6IDEwODAwLCBcImV4cGlyZV9hdFwiOiBcIjIwMjEtMTAtMjkgMjM6NDU6MzIuOTg0MDU0XCJ9IiwiZXhwIjoxNjM1NTUxMTMyfQ.KDfUcJgzaN5GER-e3pnhaLLM96ZU6CohB2LwdSehgFE';
const misApiInstance = createInstance({
  baseURL: misApiConfig.url,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const socketApiInstance = createInstance({
  baseURL: socketApiConfig.url,
  headers: {
    Authorization: `Bearer ${token}`,
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
  socket: {
    socket: socketAPI(socketApiInstance),
  },
};

export default API;
