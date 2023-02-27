import { get } from "lodash";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageProvider";

export const T = (props) => {
  const { strings } = useContext(LanguageContext);
  const { children } = props;
  if (children) {
    return get(strings, children, children);
  } else {
    return get(strings, props, props);
  }
};
