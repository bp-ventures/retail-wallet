import { filter, find, first, get, map, toLower } from "lodash";
import { Operation, TransactionBuilder } from "stellar-sdk";
import { getReceiveEstimatedValueAPI, getSendEstimatedValueAPI } from "./api/stellar";
import StellarErrorMessage from "./consts/StellarErrorMessages.json";
import { getNetworkConfig } from "./helpers";
import { getHomeDomainFromAssetIssuer } from "./stellar/sep24/getHomeDomainFromAssetIssuer";
import { getToml } from "./stellar/sep24/getToml";
import SignTrx from "./stellar/signTRX";
const StellarSdk = require("stellar-sdk");

type Network = "public" | "testnet";

export const server = () => {
  return new StellarSdk.Server(process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);
};

export const addTrustLine = async ({ pubKey, asset, connectedWallet, setIsSigningWithLedger }) => {
  const stellarServer = server();
  const networkConfigs = getNetworkConfig();

  const account = await stellarServer.loadAccount(pubKey);

  const transaction = new TransactionBuilder(account, {
    fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
    networkPassphrase: networkConfigs.network,
  })
    .addOperation(
      Operation.changeTrust({
        asset: toAsset(asset.code, asset.issuer),
      })
    )
    .setTimeout(0)
    .build();

  const signedTransaction = await SignTrx(
    connectedWallet,
    transaction,
    toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
    pubKey,
    setIsSigningWithLedger
  );
  const result = await stellarServer.submitTransaction(signedTransaction);

  return result;
};
export const destructOfferPrice = (result) => get(first(get(result, "records", [])), "price", 0);

export const getPayments = async ({ pubKey }) => {
  const result = await server().payments().limit(200).order("desc").forAccount(pubKey).call();
  return get(result, "records");
};

export const getBidOffers = async (selling, buying) => {
  return await server().offers().selling(selling).buying(buying).order("desc").call();
};

export const getLiquidityPools = async (assets) => {
  return await server().liquidityPools().forAssets(assets).call();
};

export const getTrades = async ({ base, counter }) => {
  const result = await server().trades().forAssetPair(base, counter).call();
  return get(result, "records");
};

export const makeTransactionsList = ({
  transactionsList,
  selectedAsset: { code },
  hotWalletToQueryTransactions,
  pubKey,
}) => {
  const transactionByAsset = filter(
    transactionsList,
    ({ asset_code, source_asset_code, type, from, to }) =>
      (type === "payment" && asset_code === code) || source_asset_code === code
  );
  const filteredData = hotWalletToQueryTransactions
    ? filter(
        transactionByAsset,
        ({ from, to }) => from === hotWalletToQueryTransactions || to === hotWalletToQueryTransactions
      )
    : transactionByAsset;
  return map(filteredData, ({ to, created_at, source_amount, amount, transaction_successful, transaction_hash }) => ({
    kind: to === pubKey ? "deposit" : "withdrawal",
    amount_in: to === pubKey ? (source_amount ? source_amount : amount) : amount,
    started_at: created_at,
    status: transaction_successful ? "completed" : "NA",
    more_info_url: `https://stellar.expert/explorer/${toLower(
      process.env.NEXT_PUBLIC_STELLAR_NETWORK
    )}/tx/${transaction_hash}`,
  }));
};

export const getBalances = async (pubKey, account = null) => {
  if (!account) {
    account = await server().loadAccount(pubKey);
  }
  return get(account, "balances", []);
};

export const calculateMaxXLM = (xlmBalance, subentry) => {
  const reserved = (2 + subentry) * 0.5;
  const max = xlmBalance - reserved - 0.1;

  if (max < 0) {
    return "0";
  }

  return max;
};

export const calculateReservedXLM = (subentry) => {
  return (2 + subentry) * 0.5;
};

export const getAccount = async (pubKey) => {
  return await server().loadAccount(pubKey);
};

export const returnNullIfNative = (code, itemToReturn) => (toLower(code) === "xlm" ? null : itemToReturn);
export const returnNative = (code, itemToReturn) => (toLower(code) === "xlm" ? "native" : itemToReturn);

export const getMeaningfulErrorMessage = (errorObj, defaultMessage) => {
  const operations = get(errorObj, "response.data.extras.result_codes.operations");
  const errorCode = first(operations);
  const messageByCode = find(StellarErrorMessage, { code: errorCode });
  if (messageByCode) {
    return messageByCode.message;
  } else {
    defaultMessage;
  }
};

export const calculateSendEstimatedAndPath = async (amount, fromAsset, toAsset) => {
  let fromPart = {};
  if (fromAsset.getAssetType() === "native") {
    fromPart = {
      source_asset_type: "native",
    };
  } else {
    fromPart = {
      source_asset_type: fromAsset.getAssetType(),
      source_asset_code: fromAsset.getCode(),
      source_asset_issuer: fromAsset.getIssuer(),
    };
  }
  let toPart = {};
  if (toAsset.getAssetType() === "native") {
    toPart = {
      destination_assets: "native",
    };
  } else {
    toPart = {
      destination_assets: `${toAsset.getCode()}:${toAsset.getIssuer()}`,
    };
  }
  return getSendEstimatedValueAPI({
    source_amount: amount,
    ...fromPart,
    ...toPart,
  })
    .then((res) => {
      return {
        minAmount: res.destination_amount,
        path: res.path,
      };
    })
    .catch((e) => {
      console.log(e);
      return {
        minAmount: 0,
        path: [],
      };
    });
};

export const calculateReceiveEstimatedAndPath = async (amount, fromAsset, toAsset) => {
  let fromPart = {};
  if (fromAsset.getAssetType() === "native") {
    fromPart = {
      source_assets: "native",
    };
  } else {
    fromPart = {
      source_assets: `${fromAsset.getCode()}:${fromAsset.getIssuer()}`,
    };
  }

  let toPart = {};
  if (toAsset.getAssetType() === "native") {
    toPart = {
      destination_asset_type: "native",
    };
  } else {
    toPart = {
      destination_asset_type: toAsset.getAssetType(),
      destination_asset_code: toAsset.getCode(),
      destination_asset_issuer: toAsset.getIssuer(),
    };
  }

  return getReceiveEstimatedValueAPI({
    destination_amount: amount,
    ...fromPart,
    ...toPart,
  })
    .then((res) => ({
      minAmount: res.source_amount,
      path: res.path,
    }))
    .catch((e) => {
      console.log(e);
      return {
        minAmount: 0,
        path: [],
      };
    });
};

export const destructBalance = (balances, assetCode, assetIssuer, returnObject) => {
  const BalanceObj =
    assetIssuer === null || assetIssuer === "native"
      ? find(balances, { asset_type: "native" })
      : find(balances, { asset_code: assetCode, asset_issuer: assetIssuer });
  if (BalanceObj && returnObject) {
    return BalanceObj;
  }
  if (BalanceObj) {
    return BalanceObj.balance;
  }
  if (returnObject) {
    return {};
  }
  return null;
};

export const getBalance = async (pubKey, assetCode, assetIssuer, account = null) => {
  const balances = await getBalances(pubKey, account);
  return destructBalance(balances, assetCode, assetIssuer, false);
};

export const hasSufficientBalance = (balances, assetCode, assetIssuer, amount) => {
  const BalanceObj =
    assetIssuer === "native"
      ? find(balances, { asset_type: "native" })
      : find(balances, { asset_code: assetCode, asset_issuer: assetIssuer });
  if (BalanceObj) {
    if (amount > BalanceObj.balance) {
      return false;
    }
  } else {
    return false;
  }
  return true;
};

export const hasTrust = (balances, assetCode, assetIssuer) => {
  const BalanceObj =
    assetCode === "XLM"
      ? find(balances, { asset_type: "native" })
      : find(balances, { asset_code: assetCode, asset_issuer: assetIssuer });

  if (BalanceObj) {
    return true;
  } else {
    return false;
  }
};

export const toAsset = (assetCode, assetIssuer = null) => {
  if (assetIssuer !== null && assetIssuer !== "native") {
    return new StellarSdk.Asset(assetCode, assetIssuer);
  } else {
    return new StellarSdk.Asset.native(); // eslint-disable-line
  }
};

export const toNetworkPassphrase = (network: Network) => {
  switch (network) {
    case "testnet":
      return StellarSdk.Networks.TESTNET;
    case "public":
      return StellarSdk.Networks.PUBLIC;
  }
};

export const checkAndAddTrustBeforeDeposit = async (pubKey, assetCode, assetIssuer) => {
  const balances = await getBalances(pubKey);
  if (!hasTrust(balances, assetCode, assetIssuer)) {
    const nativeBalance = destructBalance(balances, assetCode, assetIssuer, false);
  }
};

export const getAssetAndOrgSupportEmailFromToml = async (asset, hardCodedHomeDomain) => {
  const networkConfig = getNetworkConfig();
  let homeDomain = hardCodedHomeDomain;
  if (!homeDomain) {
    homeDomain = await getHomeDomainFromAssetIssuer({ assetIssuer: asset.issuer, networkUrl: networkConfig.url });
  }
  const response = await getToml(`https://${homeDomain}/.well-known/stellar.toml`);
  let orgSupportEmail = get(find(response, "ORG_SUPPORT_EMAIL"), "ORG_SUPPORT_EMAIL");

  if (!orgSupportEmail) {
    orgSupportEmail = get(find(response, "ORG_OFFICIAL_EMAIL"), "ORG_OFFICIAL_EMAIL", "");
  }
  return {
    asset: find(get(response, "CURRENCIES"), { code: asset.code }),
    orgSupportEmail,
    homeDomain,
  };
};
