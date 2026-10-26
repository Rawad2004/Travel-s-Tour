import React, { createContext, useReducer, useContext } from 'react';

const UIContext = createContext();

const initialState = {
  message: '',
  variant: 'info'
};

function uiReducer(state, action) {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.payload.message, variant: action.payload.variant || 'info' };
    case 'CLEAR_MESSAGE':
      return initialState;
    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);