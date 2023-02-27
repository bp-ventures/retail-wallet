import { useContext, useEffect, useState } from "react";
import { ToasterContext } from "../contexts";
import * as stellar from "../stellar.ts";
import useFetchBalances from "./useFetchBalances";
const useFetchBalance = ({ dependencyArray, selectedAsset }) => {
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [balanceObj, setBalanceObj] = useState({});
  const { setToasterText } = useContext(ToasterContext);
  const { fetchBalances, subentry } = useFetchBalances({
    dependencyArray: [false],
  });
  const fetchBalance = async function () {
    setIsFetchingBalance(true);
    setBalanceObj({});
    if (selectedAsset) {
      try {
        const balances = await fetchBalances();
        const result = await stellar.destructBalance(
          balances,
          selectedAsset?.code,
          selectedAsset?.issuer === "native" ? null : selectedAsset?.issuer,
          true
        );
        setIsFetchingBalance(false);
        setBalanceObj(result);
      } catch (error) {
        setToasterText(toString(error));
      }
    }
  };

  useEffect(() => {
    let isNeedToFetch = false;
    for (let obj of dependencyArray) {
      if (!obj) {
        isNeedToFetch = false;
        break;
      } else {
        isNeedToFetch = true;
      }
    }
    if (isNeedToFetch) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray);

  return { balanceObj, subentry, isFetchingBalance, fetchBalance };
};

export default useFetchBalance;
