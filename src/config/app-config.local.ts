type ApiService = 'mockApi' | 'agGridApi' | 'misApi';

interface ApiServerConfig {
  url: string;
}

interface SocketServer {
  url: string;
}

interface AppConfigLocal {
  services: { [key in ApiService]: ApiServerConfig };
  socketServer: SocketServer;
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
      url: 'http://47j1hszywm2yvn1uem.toastgslb.com/mis',
    },
  },
  socketServer: {
    url: 'ws://47j1hszywm2yvn1uem.toastgslb.com',
  },
};

export default appConfig;
