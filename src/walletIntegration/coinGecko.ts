import CoinGecko from "coingecko-api";
import { get, toNumber, find } from "lodash";
import { AssetsList } from "../consts";

const CoinGeckoClient = new CoinGecko();

export const getMarketPrice = async ({ fromAssetsIds, toAssetsCodes }) => {
  try {
    let { data, success } = await CoinGeckoClient.simple.price({
      ids: fromAssetsIds,
      vs_currencies: toAssetsCodes,
      include_24hr_change: true,
    });
    if (success) return data;
    else return null;
  } catch (error) {
    throw error;
  }
};

export const getMarketData = async ({ id }) => {
  try {
    let { data, success } = await CoinGeckoClient.coins.fetch(id, {
      market_data: true,
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
      sparkline: false,
    });
    if (success) return data;
    else return null;
  } catch (error) {
    throw error;
  }
};

export const getMarketCapacity = async ({ ids }) => {
  try {
    let { success, data } = await CoinGeckoClient.coins.markets({
      ids,
    });

    return { success, data };
  } catch (error) {
    throw error;
  }
};

export const convertIntoGeckoCoinSupportedSymbol = (assetCode) => {
  switch (assetCode) {
    case "BTCLN":
      //for BTCLN get price from coingecko (use BTC * 100 000 000)
      return "btc";

    default:
      return assetCode;
  }
};

export const calculateMarketPrice = (marketPrice, toAssetCode, fromAssetCode) => {
  //when converting to
  const multiple_market_price_with = get(find(AssetsList, { code: toAssetCode }), "coin_gecko_market_price_difference");
  //when converting from
  const divide_market_price_with = get(find(AssetsList, { code: fromAssetCode }), "coin_gecko_market_price_difference");
  if (multiple_market_price_with) {
    return marketPrice * toNumber(multiple_market_price_with);
  }
  if (divide_market_price_with) {
    return marketPrice / toNumber(divide_market_price_with);
  }

  return marketPrice;
};

export const convertIntoGeckoCoinSupportedVsCurrencies = (assetCode) => {
  //  https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  switch (assetCode) {
    case "CLPX":
      return "clp";
    case "USDC":
      return "usd";
    case "BTCLN":
      //for BTCLN get price from coingecko (use BTC * 100 000 000)
      return "btc";
    case "USDT":
      return "usd";
    default:
      return assetCode;
  }
};
