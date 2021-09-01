import { createContext, ReactNode, useContext, useState } from 'react';

export type ModalData = {
  component: ReactNode;
  drawerProps: any;
};

type State = {
  showDrawer: (data: ModalData) => void;
  closeDrawer: () => void;
};

export const DrawerContext = createContext<State | undefined>(undefined);

function DrawerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    component: null,
    drawerProps: {},
    visible: false,
  });

  const openDrawer = ({ component, drawerProps = {} }: any) => {
    setData({ ...data, component, drawerProps, visible: true });
  };

  const closeDrawer = () => {
    setData({ ...data, visible: false });
  };

  const renderComponent = () => {
    const { visible, component: Component, drawerProps } = data;

    return (
      visible && (
        // @ts-ignore
        <Component {...drawerProps} visible={visible} onClose={closeDrawer} />
      )
    );
  };

  return (
    <DrawerContext.Provider
      value={{ ...data, showDrawer: openDrawer, closeDrawer }}
    >
      {renderComponent()}
      {children}
    </DrawerContext.Provider>
  );
}

export default DrawerProvider;

export function useDrawer() {
  const state = useContext(DrawerContext);
  if (!state) throw new Error('Cannot find DrawerProvider');
  return state;
}
