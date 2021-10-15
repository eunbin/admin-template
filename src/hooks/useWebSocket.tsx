import { useEffect, useRef, useState } from 'react';
import appConfig from 'config/app-config.local';
import useNotification from 'hooks/useNotification';

interface Options {
  onConnect?: () => void;
}

const useWebSocket = (
  siteId: string,
  clientId: string,
  { onConnect }: Options
) => {
  const { showNotification } = useNotification();

  const socket = useRef<any>(null);
  const [message, setMessage] = useState();

  const connect = () => {
    socket.current = new WebSocket(
      `${appConfig.socketServer.url}/socket/ws/${siteId}/${clientId}/`
    );

    socket.current.onopen = () => {
      onConnect?.();
      showNotification({
        description: '소켓 연결에 성공했습니다.',
      });
    };

    socket.current.onerror = () => {
      showNotification({
        type: 'error',
        description: '소켓 에러가 발생했습니다.',
      });
    };

    socket.current.onclose = () => {
      showNotification({
        type: 'info',
        description: '소켓 연결을 종료했습니다',
      });
    };

    socket.current.onmessage = (event: any) => {
      setMessage(event.data);
    };
  };

  const disconnect = () => {
    socket.current.close();
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return { message, connect, disconnect };
};

export default useWebSocket;
