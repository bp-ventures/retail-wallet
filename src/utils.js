import {
  assign,
  filter,
  find,
  first,
  get,
  isUndefined,
  keys,
  last,
  omitBy,
  size,
  split,
  toLower,
  toNumber,
} from "lodash";
import { AssetsList } from "./consts";

export const makeSwapSuccessMessage = ({
  txId,
  sourceAmount,
  calculatedMinReceived,
  fromAssetCode,
  toAssetCode,
  swap_successful_translation,
  you_swapped_translation,
  for_translation,
}) => {
  return `${swap_successful_translation}! <a target="_blank" href="${`https://stellar.expert/explorer/${toLower(
    process.env.NEXT_PUBLIC_STELLAR_NETWORK
  )}/tx/${txId}`}">${you_swapped_translation} ${sourceAmount} ${fromAssetCode} ${for_translation} ${calculatedMinReceived} ${toAssetCode}</a>`;
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const makeQueryString = (params) => {
  var queryString = "";
  if (params !== undefined) {
    queryString = filter(keys(params), (key) => params[key] != null)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
  }

  return `?${queryString}`;
};

export const isChrome = () => navigator.userAgent.indexOf("Chrome") != -1;

export const destructAssetCodeAndIssuer = (assetString) => {
  var code = first(split(assetString, ":"));
  const issuer = last(split(assetString, ":"));
  if (code === "native") {
    code = "XLM";
  }
  return { code, issuer };
};
export const fetchTranslations = ({ language = "en" }) =>
  import(`./locales/${language}`).then((module) => {
    return module.default;
  });

export const calculateHealthFactor = function (balances, claimableBalance) {
  const getClaimableBalance = (code) => get(find(claimableBalance, { code: code }), "balance", 0);

  let hp = 0;
  const XLM = findAssetBalance(find(AssetsList, { code: "XLM" }), balances);
  const UsdcBalance = findAssetBalance(find(AssetsList, { code: "USDC" }), balances);
  const ClpxBalance = findAssetBalance(find(AssetsList, { code: "CLPX" }), balances);
  const BTCBalance = findAssetBalance(find(AssetsList, { code: "BTC" }), balances);
  const ETHBalance = findAssetBalance(find(AssetsList, { code: "ETH" }), balances);
  const UsdcLocked = getClaimableBalance("USDC");
  const CLPXLocked = getClaimableBalance("CLPX");
  if (XLM > 3.5) {
    hp = 3.5;
  } else {
    hp = toNumber(XLM);
  }
  if (UsdcBalance === 0) {
    hp = toNumber(hp - 1);
  } else {
    hp = toNumber(hp + 1);
  }
  if (UsdcLocked > 0) {
    hp = toNumber(hp + 1);
  }
  if (CLPXLocked > 1) {
    hp = toNumber(hp + 1);
  }
  if (ClpxBalance > 0) {
    hp = toNumber(hp + 1);
  }
  if (BTCBalance > 0) {
    hp = toNumber(hp + 1);
  }
  if (ETHBalance > 0) {
    hp = toNumber(hp + 1);
  }
  return hp;
};

export const makeStallerExpertMarketURL = function (asset) {
  const baseURL = "https://stellar.expert/explorer/public/asset";
  const queryParams = "?filter=markets";
  const assetCode = get(asset, "code");
  if (assetCode === "XLM") {
    return `${baseURL}/${assetCode}${queryParams}`;
  }
  const assetIssuer = get(asset, "issuer");
  return `${baseURL}/${assetCode}-${assetIssuer}${queryParams}`;
};
export const calculatePercentage = function (number, percentage) {
  return (parseFloat(percentage) / 100) * parseFloat(number);
};
export const truncateFromCenter = function (fullStr, strLen, separator) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

export const openLinkInNewTab = (link) => {
  const win = window.open(link, "_blank");
  win.focus();
};

export const checkIfNative = (code) => (toLower(code) === "xlm" ? "native" : code);

export const getCurrencyIdBySymbol = (marketCap, symbol) => get(find(marketCap, { symbol: toLower(symbol) }), "id");

export const isNative = (code) => code === "native" || toLower(code) === "xlm";

export const findAssetBalance = (asset, balances) => {
  const isNativeAsset = isNative(asset?.code);
  const key = isNativeAsset ? "asset_type" : "asset_code";
  const objToFind = { [key]: checkIfNative(asset?.code) };
  if (!isNativeAsset) {
    assign(objToFind, {
      asset_issuer: asset?.issuer,
    });
  }
  return get(find(balances, objToFind), "balance", 0);
};

export const calculatePercentageDiff = (a, b) =>
  100 * Math.abs((toNumber(a) - toNumber(b)) / ((toNumber(a) + toNumber(b)) / 2));

export const queryStringToObject = () => {
  if (typeof window !== "undefined") {
    let search = window.location.search;
    return Object.fromEntries(new URLSearchParams(search));
  }
  return {};
};

export function secIntoMin(time) {
  const sec = parseInt(time, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = "" + hours;
  }
  if (minutes < 10) {
    minutes = "" + minutes;
  }
  if (seconds < 10) {
    seconds = "" + seconds;
  }
  if (hours == 0) {
    if (minutes == 0) {
      return seconds + "sec"; // Return in MM:SS format
    } else if (seconds == 0) return +minutes + "m";
    else return +minutes + "m:" + seconds + "s"; // Return in MM:SS format
  } else {
    let result = "";
    result += hours === "0" ? "" : `${hours}h`;
    result += minutes === "0" ? "" : `${minutes}m`;
    result += seconds === "0" ? "" : `${seconds}s`;
    return result; // Return in HH:MM:SS format
  }
}

export const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone ||
  document.referrer.includes("android-app://");

export function abortableFetch(request, opts) {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    abort: () => controller.abort(),
    ready: fetch(request, { ...opts, signal }),
  };
}

let formatter = Intl.NumberFormat("en", { notation: "compact" });

export const getMarketSize = (marketCap, code) =>
  formatter.format(get(find(marketCap, { symbol: toLower(code) }), "market_cap", ""));

export const filterUndefinedValues = (obj) => omitBy(obj, (v) => isUndefined(v));

export const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  parts[1] = size(parts[1]) > 7 ? parts[1].substr(0, 7) : parts[1];

  return parts.join(".");
};
