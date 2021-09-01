type ApiService = 'mockApi' | 'agGridApi';

interface ApiServerConfig {
  url: string;
}

interface AppConfigLocal {
  services: { [key in ApiService]: ApiServerConfig };
}

const appConfig: AppConfigLocal = {
  services: {
    mockApi: {
      url: 'https://jsonplaceholder.typicode.com',
    },
    agGridApi: {
      url: 'https://www.ag-grid.com',
    },
  },
};

export default appConfig;
