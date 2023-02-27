import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const GlobalStateContext = React.createContext();

const GlobalStateProvider = (props) => {
  const [isSigningWithLedger, setIsSigningWithLedger] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const getBootStrapComponentVariant = () => (isDarkTheme ? "dark" : "light");

  return (
    <GlobalStateContext.Provider
      value={{
        isSigningWithLedger,
        setIsSigningWithLedger,
        isDarkTheme,
        setIsDarkTheme,
        getBootStrapComponentVariant,
      }}
    >
      {props.children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
