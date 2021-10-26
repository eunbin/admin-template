import React, { useReducer, useContext, createContext, Dispatch } from 'react';

type State = {
  siteId: number;
  clientId: string;
};

type Action =
  | { type: 'SET_SITE_ID'; siteId: number }
  | { type: 'SET_CLIENT_ID'; clientId: string };

type AppDataDispatch = Dispatch<Action>;

const AppDataStateContext = createContext<State | null>(null);
const AppDataDispatchContext = createContext<AppDataDispatch | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SITE_ID':
      return {
        ...state,
        siteId: action.siteId,
      };
    case 'SET_CLIENT_ID':
      return {
        ...state,
        clientId: action.clientId,
      };
    default:
      throw new Error('Unhandled action');
  }
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    siteId: 0,
    clientId: '',
  });

  return (
    <AppDataStateContext.Provider value={state}>
      <AppDataDispatchContext.Provider value={dispatch}>
        {children}
      </AppDataDispatchContext.Provider>
    </AppDataStateContext.Provider>
  );
}

export function useAppDataState() {
  const state = useContext(AppDataStateContext);
  if (!state) throw new Error('Cannot find AppDataProvider');
  return state;
}

export function useAppDataDispatch() {
  const dispatch = useContext(AppDataDispatchContext);
  if (!dispatch) throw new Error('Cannot find AppDataProvider');
  return dispatch;
}
