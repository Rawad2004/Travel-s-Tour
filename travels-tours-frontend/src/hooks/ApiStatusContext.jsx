import { createContext, useContext, useReducer } from "react";

const ApiStatusContext = createContext(null);

function statusReducer(state, action) {
  switch (action.type) {
    case "setError":
      return { ...state, error: action.error || "" };
    case "clearError":
      return { ...state, error: "" };
    case "setMessage":
      return { ...state, message: action.message || "" };
    case "clearMessage":
      return { ...state, message: "" };
    default:
      return state;
  }
}

export function ApiStatusProvider({ children }) {
  const [state, dispatch] = useReducer(statusReducer, {
    error: "",
    message: "",
  });

  return (
    <ApiStatusContext.Provider value={{ state, dispatch }}>
      {children}
    </ApiStatusContext.Provider>
  );
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error("useApiStatus must be used within ApiStatusProvider");
  }
  return context;
}
