type ApiService = 'mockApi' | 'agGridApi' | 'misApi';

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
    misApi: {
      url: 'http://133.186.201.86/mis',
    },
  },
};

export default appConfig;
