import { createContext, ReactNode, useContext, useState } from 'react';

export type ModalData = {
  component: ReactNode;
  modalProps: any;
};

type State = {
  showModal: (data: ModalData) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<State | undefined>(undefined);

function ModalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    component: null,
    modalProps: {},
    visible: false,
  });

  const showModal = ({ component, modalProps = {} }: any) => {
    setData({ ...data, component, modalProps, visible: true });
  };

  const closeModal = () => {
    setData({ ...data, visible: false });
  };

  const renderComponent = () => {
    const { visible, component: Component, modalProps } = data;

    return (
      visible && (
        // @ts-ignore
        <Component {...modalProps} visible={visible} onClose={closeModal} />
      )
    );
  };

  return (
    <ModalContext.Provider value={{ ...data, showModal, closeModal }}>
      {renderComponent()}
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;

export function useModal() {
  const state = useContext(ModalContext);
  if (!state) throw new Error('Cannot find ModalProvider');
  return state;
}
