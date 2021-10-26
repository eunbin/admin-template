import { useEffect, useRef, useState } from 'react';
import appConfig from 'config/app-config.local';
import useNotification from 'hooks/useNotification';
import useVisibilityChange from 'hooks/useVisibilityChange';

interface Options {
  enabled: boolean;
  visibilityChange?: boolean;
  onConnect?: () => void;
  onMessage?: (event: any) => void;
}

const useWebSocket = (
  siteId: number,
  clientId: string,
  { enabled, visibilityChange, onConnect, onMessage }: Options
) => {
  const { showNotification } = useNotification();

  const socket = useRef<any>(null);
  const [message, setMessage] = useState<string>('');

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
      const message = event.data as string;
      setMessage(message);
      onMessage?.(message);
    };
  };

  const disconnect = () => {
    socket.current.close();
  };

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (enabled) {
        disconnect();
      }
    };
  }, [enabled]);

  useVisibilityChange(
    visibilityChange ? { onHide: disconnect, onShow: connect } : {}
  );

  return { message, connect, disconnect };
};

export default useWebSocket;
