import { clone, filter, find, forEach, get, map, round, size, toLower, toString } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import * as coinGecko from "../../../walletIntegration/coinGecko.ts";
import AssetsList from "../../../consts/AssetsList.json";
import { AuthContext, ToasterContext } from "../../../contexts";
import { getAssetDetails, getNetworkConfig } from "../../../helpers";
import { getBalances, getClaimableBalance, getStrictSendPaths } from "../../../stellar/";
import { getHomeDomainFromAssetIssuer } from "../../../stellar/sep24/getHomeDomainFromAssetIssuer";
import { getToml } from "../../../stellar/sep24/getToml";
import * as stellar from "../../../stellar";
import { checkIfNative, destructAssetCodeAndIssuer, findAssetBalance, getMarketSize } from "../../../utils";

const useTableData = () => {
  const {
    isLoggedIn,
    pubKey,
    valuesInUSDC,
    setValuesInUSDC,
    setBalances,
    balances,
    setMarketCap,
    claimableBalance,
    setClaimAbleBalance,
    marketCap,
    refreshBalances,
    claimableBalanceInUSDC,
    setClaimableBalanceInUSDC,
    setAssetDescriptions,
  } = useContext(AuthContext);
  const { setToasterText } = useContext(ToasterContext);
  const getValueInUSDC = (code) => round(get(find(valuesInUSDC, { code }), "value_in_usdc", 0), 2);
  const getLockedAmount = (code) => get(find(claimableBalance, { code }), "balance", 0);
  const roundRate = (value) => `${round(value, 2).toFixed(1)}%`;

  const [filteredList, setFilteredList] = useState(AssetsList);

  useEffect(() => {
    if (isLoggedIn) {
      setFilteredList(
        filter(
          AssetsList,
          ({ showOnDashboardByDefault, code, issuer }) =>
            showOnDashboardByDefault || stellar.hasTrust(balances, code, issuer)
        )
      );
    } else {
      setFilteredList(AssetsList);
    }
  }, [isLoggedIn, balances]);

  const data = useMemo(() => {
    return map(filteredList, (asset) => ({
      asset: asset,
      market_size: asset.market_size ? asset.market_size : getMarketSize(marketCap, asset.code),
      rate: roundRate(asset.interest_rate),
      lock_months: asset.lock_months,
      locked_amount: isLoggedIn ? getLockedAmount(checkIfNative(asset.code)) : "",
      value_in_usdc: isLoggedIn ? getValueInUSDC(asset.code) : "",
      unLocked_amount: isLoggedIn ? findAssetBalance(asset, balances) : "",
      type: asset.type,
      lockable: asset.lockable,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, balances, claimableBalance, valuesInUSDC, marketCap]);

  useEffect(() => {
    return function cleanUp() {
      setBalances([]);
      setValuesInUSDC([]);
      setClaimAbleBalance([]);
      setClaimableBalanceInUSDC([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // fetching balances values in USDC
    if (isLoggedIn) {
      if (size(balances) > 0) {
        forEach(filteredList, async (asset) => {
          const balance = findAssetBalance(asset, balances);

          if (balance > 0) {
            const value_in_usdc = await getStrictSendPaths(
              getAssetDetails(asset),
              balance,
              getAssetDetails(find(AssetsList, { code: "USDC" }))
            );
            if (value_in_usdc) {
              const tempValuesInUSDC = valuesInUSDC;
              tempValuesInUSDC.push({
                code: asset.code,
                value_in_usdc,
              });
              setValuesInUSDC(clone(tempValuesInUSDC));
            }
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, isLoggedIn]);

  useEffect(() => {
    async function fetchAssetDescription() {
      const networkConfig = getNetworkConfig();
      let assetDescriptions = [];
      for await (const asset of filteredList) {
        const { issuer: assetIssuer, code } = asset;
        if (code !== "XLM") {
          try {
            const homeDomain = await getHomeDomainFromAssetIssuer({
              assetIssuer,
              networkUrl: networkConfig.url,
            });
            const tomlResponse = await getToml(homeDomain);
            const desc = get(find(get(tomlResponse, "CURRENCIES"), { code }), "desc");
            assetDescriptions.push({ code, desc });
            setAssetDescriptions(clone(assetDescriptions));
          } catch (error) {
            setToasterText(toString(error));
          }
        }
      }
    }
    fetchAssetDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchMarketCap() {
      // fetching market capacity
      let { success, data: marketCap } = await coinGecko.getMarketCapacity({
        ids: map(filter(filteredList, "coin_gecko_id"), "coin_gecko_id"),
      });

      if (success) {
        setMarketCap(marketCap);
      }
    }
    fetchMarketCap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchData() {
      // fetching balances,claimable balances and claimable value in USDC
      if (pubKey) {
        setBalances([]);
        setClaimableBalanceInUSDC([]);
        setClaimAbleBalance([]);
        setValuesInUSDC([]);

        try {
          const accountBalances = await getBalances(pubKey);
          const result = await getClaimableBalance(pubKey);
          const records = get(result, "records", []);
          forEach(records, async ({ asset, amount }, key) => {
            const { code, issuer } = destructAssetCodeAndIssuer(asset);

            let temp = claimableBalance;
            let tempB = claimableBalanceInUSDC;

            const value_in_usdc = await getStrictSendPaths(
              getAssetDetails({ code, issuer }),
              amount,
              getAssetDetails(find(AssetsList, { code: "USDC" }))
            );
            temp.push({ code, balance: amount });
            tempB.push({ code, value_in_usdc });
            setClaimAbleBalance(clone(temp));
            setClaimableBalanceInUSDC(clone(tempB));
          });

          setBalances(accountBalances);
        } catch (error) {
          setToasterText(toString(error));
        }
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubKey, refreshBalances]);

  return { data, isLoggedIn };
};

export default useTableData;
