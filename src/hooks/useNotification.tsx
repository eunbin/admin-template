import { notification } from 'antd';
import { IconType } from 'antd/es/notification';
import { ReactNode } from 'react';

interface Props {
  type?: IconType;
  message?: ReactNode;
  description: ReactNode;
}

const useNotification = () => {
  const showNotification = ({
    type = 'success',
    message = type,
    description,
  }: Props) =>
    notification.open({
      type,
      message,
      description,
    });

  return { showNotification };
};

export default useNotification;
