import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppWrapper({ children }) {
  const [GlobalState, setGlobalState] = useState({
    name: null,
    email: null,
    id: null,
  });

  useEffect(() => {
    setGlobalState((prevState) => ({
      ...prevState,
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      id: localStorage.getItem("id"),
    }));
  }, []);

  return (
    <AppContext.Provider value={{ GlobalState, setGlobalState }}>
      {children}
    </AppContext.Provider>
  );
}
