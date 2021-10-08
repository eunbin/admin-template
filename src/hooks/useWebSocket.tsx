import { useEffect, useRef, useState } from 'react';
import appConfig from 'config/app-config.local';

const useWebSocket = (siteId: string, clientId: string) => {
  const socket = useRef<any>(null);
  const [message, setMessage] = useState();

  const connect = () => {
    socket.current = new WebSocket(
      `${appConfig.socketServer.url}/socket/ws/${siteId}/${clientId}/`
    );

    socket.current.onopen = () => {};

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

  return { message };
};

export default useWebSocket;
