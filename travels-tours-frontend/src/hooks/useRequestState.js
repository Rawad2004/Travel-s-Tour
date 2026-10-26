import { useReducer } from "react";

function requestReducer(state, action) {
  switch (action.type) {
    case "start":
      return { loading: true, error: "", message: "" };
    case "success":
      return { loading: false, error: "", message: action.message || "" };
    case "failure":
      return { loading: false, error: action.error || "", message: "" };
    case "reset":
      return { loading: false, error: "", message: "" };
    default:
      return state;
  }
}

export function useRequestState() {
  const [state, dispatch] = useReducer(requestReducer, {
    loading: false,
    error: "",
    message: "",
  });

  const start = () => dispatch({ type: "start" });
  const success = (message) => dispatch({ type: "success", message });
  const failure = (error) => dispatch({ type: "failure", error });
  const reset = () => dispatch({ type: "reset" });

  return { ...state, start, success, failure, reset };
}
