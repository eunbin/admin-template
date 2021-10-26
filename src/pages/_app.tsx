// https://github.com/SolidZORO/next-plugin-antd-less#how-to-import-global-less-style-eg-stylesless
require('styles/App.less');

import { QueryClient, QueryClientProvider } from 'react-query';
import type { AppProps } from 'next/app';
import ModalProvider from 'contexts/ModalProvider';
import DrawerProvider from 'contexts/DrawerProvider';
import AppProvider from 'contexts/AppProvider';
import { AppDataProvider } from 'contexts/AppDataProvider';
import Head from 'next/head';
import 'styles/react-kanban.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <Head>
        <title>React Admin Template</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AppDataProvider>
          <AppProvider>
            <ModalProvider>
              <DrawerProvider>
                <Component {...pageProps} />
              </DrawerProvider>
            </ModalProvider>
          </AppProvider>
        </AppDataProvider>
      </QueryClientProvider>
    </div>
  );
}
export default MyApp;
