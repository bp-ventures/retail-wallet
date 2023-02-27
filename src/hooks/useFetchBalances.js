import { get } from "lodash";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts";
import * as stellar from "../stellar.ts";
const useFetchBalances = ({ dependencyArray }) => {
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [balances, setBalances] = useState([]);
  const [subentry, setSubentry] = useState(0);
  const { pubKey } = useContext(AuthContext);
  const fetchBalances = async function () {
    setIsFetchingBalances(true);
    setBalances([]);
    if (pubKey) {
      try {
        const account = await stellar.getAccount(pubKey);
        const balances = get(account, "balances", []);
        setSubentry(get(account, "subentry_count", 0));
        setBalances(balances);
        setIsFetchingBalances(false);
        return balances;
      } catch (error) {
        setIsFetchingBalances(false);
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
      fetchBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray);

  return { balances, subentry, isFetchingBalances, fetchBalances };
};

export default useFetchBalances;
