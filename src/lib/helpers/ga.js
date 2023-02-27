import { assign } from "lodash";
import { getPubKeyItem } from "./localStorageApp";

// log the pageview with their URL
export const pageview = (url) => {
  const params = { page_path: url };
  const pubKey = getPubKeyItem();

  window.gtag(
    "config",
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    pubKey ? assign(params, { user_id: pubKey }) : params
  );
  if (pubKey) {
    set({ name: "user_properties", params: { pubKey: pubKey } });
  }
};

// set
export const set = ({ name, params }) => {
  window.gtag("set", name, params);
};

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag("event", action, params);
};
