import { Drawer, Button } from 'antd';
import { ReactNode } from 'react';

interface Props {
  visible: boolean;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  onClose: () => void;
}

const RightDrawer = ({
  visible,
  title,
  children,
  onSubmit,
  onClose,
}: Props) => {
  return (
    <Drawer
      title={title}
      width={720}
      onClose={onClose}
      visible={visible}
      // closable={false}
      // mask={false}
      // maskClosable={true}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          css={{
            textAlign: 'left',
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={onSubmit} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      {children}
    </Drawer>
  );
};

export default RightDrawer;
