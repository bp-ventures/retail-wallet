import { isValidPubKey, getPubKeyItem, getItem } from "../lib/helpers/localStorageApp";
import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isValidPubKey());
  const [connectedWallet, setConnectedWallet] = useState(getItem("connectedWallet"));
  const [pubKey, setPubKey] = useState(getPubKeyItem());
  const [balances, setBalances] = useState([]);
  const [marketCap, setMarketCap] = useState([]);
  const [claimableBalance, setClaimAbleBalance] = useState([]);
  const [claimableBalanceInUSDC, setClaimableBalanceInUSDC] = useState([]);
  const [valuesInUSDC, setValuesInUSDC] = useState([]);
  const [refreshBalances, setRefreshBalances] = useState(false);
  const [assetDescriptions, setAssetDescriptions] = useState([]);
  const resetState = () => {
    setPubKey(null);
    setBalances([]);
    setClaimAbleBalance([]);
    setClaimableBalanceInUSDC([]);
    setValuesInUSDC([]);
  };
  useEffect(() => {
    if (!isLoggedIn) {
      resetState();
    }
  }, [isLoggedIn]);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        pubKey,
        setPubKey,
        balances,
        setBalances,
        marketCap,
        setMarketCap,
        claimableBalance,
        setClaimAbleBalance,
        valuesInUSDC,
        setValuesInUSDC,
        connectedWallet,
        setConnectedWallet,
        refreshBalances,
        setRefreshBalances,
        claimableBalanceInUSDC,
        setClaimableBalanceInUSDC,
        assetDescriptions,
        setAssetDescriptions,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
