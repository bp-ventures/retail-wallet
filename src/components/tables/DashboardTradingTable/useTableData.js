import { filter, find, get, map, round, toLower } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import AssetsList from "../../../consts/AssetsList.json";
import { AuthContext } from "../../../contexts";
import * as stellar from "../../../stellar";
import { returnNative, returnNullIfNative } from "../../../stellar";
import { findAssetBalance, getCurrencyIdBySymbol, getMarketSize } from "../../../utils";
import * as coinGecko from "../../../walletIntegration/coinGecko.ts";

const useTableData = () => {
  const { isLoggedIn, valuesInUSDC, balances, claimableBalance, marketCap } = useContext(AuthContext);
  const [stellarTermData, setStellarTermData] = useState([]);
  const [coinGeckoPriceInUsdc, setCoinGeckoPriceInUsdc] = useState({});
  const [coinGeckoPricePercentageChange1h, setCoinGeckoPricePercentageChange1h] = useState([]);
  const [filteredList, setFilteredList] = useState(AssetsList);
  useEffect(() => {
    setFilteredList(
      isLoggedIn
        ? filter(
            AssetsList,
            ({ showOnDashboardByDefault, code, issuer }) =>
              showOnDashboardByDefault || stellar.hasTrust(balances, code, issuer)
          )
        : AssetsList
    );
  }, [balances, isLoggedIn]);

  const data = useMemo(() => {
    return map(filteredList, (asset) => {
      const stellarTermAsset = find(stellarTermData, {
        code: asset?.code,
        issuer: returnNullIfNative(asset?.code, asset?.issuer),
      });
      return {
        asset: asset,
        market_size: asset.market_size ? asset.market_size : getMarketSize(marketCap, asset.code),
        price_USD: get(stellarTermAsset, "price_USD"),
        change24h_USD:
          asset?.code === "XLM"
            ? round(get(coinGeckoPriceInUsdc, "stellar.usd_24h_change"), 2)
            : get(stellarTermAsset, "change24h_USD"),
        volume24h_USD: get(stellarTermAsset, "volume24h_USD"),
        coinGeckoPricePercentageChange1h: get(
          find(coinGeckoPricePercentageChange1h, { code: asset?.code }),
          "price_change_percentage_1h"
        ),
        coingecko_price: coinGecko.calculateMarketPrice(
          get(
            coinGeckoPriceInUsdc,
            `${getCurrencyIdBySymbol(
              marketCap,
              toLower(coinGecko.convertIntoGeckoCoinSupportedSymbol(asset?.code))
            )}.usd`
          ),
          "usd",
          asset?.code
        ),
        unLocked_amount: isLoggedIn ? findAssetBalance(asset, balances) : "",
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoggedIn,
    stellarTermData,
    balances,
    claimableBalance,
    coinGeckoPricePercentageChange1h,
    valuesInUSDC,
    marketCap,
    coinGeckoPriceInUsdc,
    filteredList,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchCoinGeckoMarketPrice() {
      const fromAssetsIds = [
        filter(
          map(filteredList, ({ code }) =>
            getCurrencyIdBySymbol(marketCap, toLower(coinGecko.convertIntoGeckoCoinSupportedSymbol(code)))
          )
        ),
      ];

      const toAssetsCodes = ["usd"];

      try {
        const data = await coinGecko.getMarketPrice({
          fromAssetsIds,
          toAssetsCodes,
        });

        if (data) {
          setCoinGeckoPriceInUsdc(data);
          // const marketPrice = asset.code === "CLPX" ? 100 / result : result;
        }
      } catch (error) {
        // setMarketPrice("NA");
        // setToasterText(() => T("messages.fetching_market_price_error"))
      }
    }

    const fetchCoinGeckoMarketData = async () => {
      let list = [];
      for await (const asset of filteredList) {
        const id = getCurrencyIdBySymbol(
          marketCap,
          toLower(coinGecko.convertIntoGeckoCoinSupportedSymbol(asset?.code))
        );
        if (id) {
          const result = await coinGecko.getMarketData({ id });
          const price_change_percentage_1h = get(result, "market_data.price_change_percentage_1h_in_currency.usd");
          list.push(list, { code: asset?.code, price_change_percentage_1h });
        }
      }
      setCoinGeckoPricePercentageChange1h(list);
    };
    if (marketCap) {
      fetchCoinGeckoMarketPrice();
      fetchCoinGeckoMarketData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketCap, filteredList]);

  useEffect(() => {
    const fetchDataFromStellarTerm = () => {
      fetch("https://api.stellarterm.com/v1/ticker.json").then(async (res) => {
        const { assets } = await res.json();
        if (assets) {
          setStellarTermData(
            filter(assets, ({ code, issuer }) => find(filteredList, { code, issuer: returnNative(code, issuer) }))
          );
        }
      });
    };

    fetchDataFromStellarTerm();
  }, [filteredList]);

  return { data, isLoggedIn };
};

export default useTableData;
