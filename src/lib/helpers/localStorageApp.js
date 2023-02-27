import { find, isArray, isEmpty, remove } from "lodash";

export const addItem = (key, value = "") => {
  if (process.browser) {
    if (key) localStorage.setItem(key, value);
  }
};

export const getItem = (key) => {
  if (process.browser) {
    return localStorage.getItem(key);
  }
};
export const clearItem = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

export const getPubKeyItem = () => {
  return getItem("pubKey");
};

export const getToken = () => {
  const data = getTokenItem();
  if (data) {
    return JSON.parse(getItem("token")).token;
  }
  return null;
};

export const clearToken = () => {
  clearItem("token");
};

export const addToken = (tokenObject) => {
  addItem("token", tokenObject);
};

export const getTransactionTokens = () => {
  const allTransactions = JSON.parse(getItem("transactionTokens"));
  if (isArray(allTransactions)) {
    return allTransactions;
  } else return [];
};

export const addTransactionToken = (token) => {
  const tokens = getTransactionTokens();

  remove(tokens, {
    publicKey: token.publicKey,
    authEndpoint: token.authEndpoint,
  });

  addItem("transactionTokens", JSON.stringify([...tokens, token]));
  return null;
};

export const getTransactionToken = ({ publicKey, authEndpoint }) => {
  const allTransactions = getTransactionTokens();

  const savedTokenObj = find(allTransactions, { publicKey, authEndpoint });
  if (savedTokenObj) {
    return savedTokenObj.token;
  }
  return null;
};

export const getUser = () => {
  const token = getTokenItem();

  if (token) {
    return JSON.parse(token).userData;
  }
  return null;
};

export const isValidPubKey = () => {
  const pubKey = getPubKeyItem();
  if (pubKey) return true;
  return false;
};

export const storeInLocalStorageAfterLogin = (data) => {
  const { token } = data;
  if (isEmpty(token)) data.token = getToken();
  addToken(
    JSON.stringify({
      ...data,
    })
  );
};

export const Logout = () => {
  clearItem("token");
  clearItem("redirect_url");

  window.location.reload();
};

export const getRedirectUrl = () => getItem("redirect_url");

export const setRedirectUrl = (value) => {
  addItem("redirect_url", value);
};

export const setCurrentUrlAsRedirectUrl = () =>
  setRedirectUrl(window.location.pathname + window.location.search);
