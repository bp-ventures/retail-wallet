import { includes } from "lodash";
import React, { useEffect, useState } from "react";
import { T } from "../components/translation";

export const ToasterContext = React.createContext();

const ToasterProvider = (props) => {
  const [showToaster, setShowToaster] = useState(false);
  const [toasterText, setToasterText] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (toasterText) {
      if (includes(toasterText, "messages.")) {
        //handling multi lingual messages
        //toasterText will be the translation key passed by the calling component
        setToasterText(() => T(toasterText));
      }
      setShowToaster(true);
    }
  }, [toasterText]);
  return (
    <ToasterContext.Provider
      value={{
        showToaster,
        toasterText,
        isSuccess,
        setIsSuccess,
        setShowToaster,
        setToasterText,
      }}
    >
      {props.children}
    </ToasterContext.Provider>
  );
};

export default ToasterProvider;
