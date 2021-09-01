import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import menus from 'config/menus';
import { useRouter } from 'next/router';

type State = {
  gnbMenu: string | null;
  setGnbMenu: (menuPath: string) => void;
  menuOpenKeys: string[];
  handleMenuOpenChange: (keys: string[]) => void;
};

export const AppContext = createContext<State | undefined>(undefined);

function AppProvider({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  const [gnbMenu, setGnbMenu] = useState<string | null>(null);
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

  const defaultMenu = useMemo(
    () => `/${pathname.split('/').filter((path) => path)[0]}`,
    [pathname]
  );
  const lnbMenus = useMemo(
    () => menus.find((menu) => menu.path === defaultMenu),
    [defaultMenu]
  );

  const rootSubmenuKeys: string[] = lnbMenus?.children.map(
    (menu: any) => menu.path
  );

  const handleMenuOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => menuOpenKeys.indexOf(key) === -1);

    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setMenuOpenKeys(keys);
    } else {
      setMenuOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <AppContext.Provider
      value={{ gnbMenu, setGnbMenu, menuOpenKeys, handleMenuOpenChange }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;

export function useApp() {
  const state = useContext(AppContext);
  if (!state) throw new Error('Cannot find AppProvider');
  return state;
}
