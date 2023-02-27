import { useContext, useEffect, useState } from "react";
import { ToasterContext } from "../contexts";
import * as stellar from "../stellar.ts";
const useFetchTrades = ({ dependencyArray, base, counter }) => {
  const [isFetchingTrades, setIsFetchingTrades] = useState(false);
  const [trades, setTrades] = useState([]);
  const { setToasterText } = useContext(ToasterContext);

  const fetchTrades = async function () {
    setIsFetchingTrades(true);
    setTrades([]);
    try {
      const result = await stellar.getTrades({
        base: stellar.toAsset(base?.code, base?.issuer),
        counter: stellar.toAsset(counter?.code, counter?.issuer),
      });

      setIsFetchingTrades(false);
      setTrades(result);
    } catch (error) {
      const t = error;

      setToasterText(toString(error));
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
      fetchTrades();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray);

  return { trades, isFetchingTrades, fetchTrades };
};

export default useFetchTrades;
