import classnames from "classnames";
import { isUndefined } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css"; // for ES6 modules
import { GlobalStateContext } from "../contexts";
import { addItem, getItem } from "../lib/helpers/localStorageApp";

const DarkModeToggle = ({ className }) => {
  const { isDarkTheme, setIsDarkTheme } = useContext(GlobalStateContext);
  const [storeInLocalStorage, setStoreInLocalStorage] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;
    const storedThemeMode = getItem("themeColor");
    if (storedThemeMode) {
      setStoreInLocalStorage(true);
      setIsDarkTheme(storedThemeMode === "dark");
    } else {
      setStoreInLocalStorage(false);
      setIsDarkTheme(!prefersDark);
      setTimeout(() => setIsDarkTheme(prefersDark), 0.1);
    }
  }, []);

  useEffect(() => {
    if (isUndefined(isDarkTheme)) return;
    if (isDarkTheme) {
      storeInLocalStorage && addItem("themeColor", "dark");
      document.body.classList.add("dark");
      setIsDarkTheme(true);
    } else {
      storeInLocalStorage && addItem("themeColor", "light");
      document.body.classList.remove("dark");
      setIsDarkTheme(false);
    }
  }, [isDarkTheme, storeInLocalStorage]);

  return (
    <Toggle
      className={classnames("dark-mode-toggle", className)}
      checked={isDarkTheme}
      onChange={({ target }) => {
        setIsDarkTheme(target.checked);
        setStoreInLocalStorage(true);
      }}
      icons={{ checked: "🔆", unchecked: "🌙" }}
      aria-label="Dark mode toggle"
    />
  );
};
export default DarkModeToggle;
