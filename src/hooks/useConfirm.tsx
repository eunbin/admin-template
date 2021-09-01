import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface ConfirmProps {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
}

const useConfirm = () => {
  const showConfirm = ({
    title,
    content,
    okText = 'Confirm',
    cancelText = 'Cancel',
    onOk,
  }: ConfirmProps) => {
    return Modal.confirm({
      title: title || 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content,
      okText,
      cancelText,
      onOk,
    });
  };

  return { showConfirm };
};

export default useConfirm;
