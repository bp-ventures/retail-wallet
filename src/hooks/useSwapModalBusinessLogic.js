import { find, first, get, round, toLower, toNumber, toString } from "lodash";
import { useContext, useEffect, useState } from "react";
import { T } from "../components/translation";
import { AuthContext, GlobalStateContext, ToasterContext } from "../contexts";
import { doTrade, getAssetDetails } from "../helpers";
import * as ga from "../lib/helpers/ga";
import * as stellar from "../stellar.ts";
import { calculatePercentage, calculatePercentageDiff, getCurrencyIdBySymbol, makeSwapSuccessMessage } from "../utils";
import * as coinGecko from "../walletIntegration/coinGecko.ts";
import { useFetchBalance, useFetchTrades } from "./";

const useSwapModalBusinessLogic = ({ toggleModal, data, isSwapModalVisible }) => {
  const asset = get(data, "asset", "");
  const { connectedWallet, pubKey, refreshBalances, setRefreshBalances, marketCap } = useContext(AuthContext);
  const { isSigningWithLedger, setIsSigningWithLedger } = useContext(GlobalStateContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const [lastChange, setLastChange] = useState("");
  const [isDetailsCardVisible, setIsDetailsCardVisible] = useState(false);
  const [toAsset, setToAsset] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [sourceAmount, setSourceAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [marketPrice, setMarketPrice] = useState("");
  const [percentageDiff, setPercentageDiff] = useState("");
  const [slippageTolerancePercentage, setSlippageTolerancePercentage] = useState("1");
  const [calculatedMinReceived, setCalculatedMinReceived] = useState(0); //min Amount after subtracting slippage amount
  const [balance, setBalance] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [rate, setRate] = useState(0);
  const [isSuperSwapSelected, setIsSuperSwapSelected] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [reserves, setReserves] = useState([]);
  const [isFetchingLiquidityPools, setIsFetchingLiquidityPools] = useState(false);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);
  const [isSuperSwapModalVisible, setIsSuperSwapModalVisible] = useState(false);
  const [path, setPath] = useState([]);
  const swap_successful_translation = T("messages.swap_successful");
  const you_swapped_translation = T("messages.you_swapped");
  const for_translation = T("messages.for");
  const { isFetchingBalance, balanceObj, fetchBalance, subentry } = useFetchBalance({
    dependencyArray: [isSwapModalVisible, asset],
    selectedAsset: asset,
  });

  const { isFetchingTrades, trades } = useFetchTrades({
    dependencyArray: [isSwapModalVisible, asset, toAsset],
    base: asset,
    counter: toAsset,
  });

  useEffect(() => {
    if (trades) {
      const { n, d } = get(first(trades), "price", {});
      setLastPrice(toNumber(n) / toNumber(d));
    }
  }, [trades]);

  useEffect(() => {
    if (toAmount) {
      //calculate price impact
      const amount_stellar = sourceAmount * (minAmount / sourceAmount);
      const amount_market = sourceAmount * marketPrice;
      const priceImpact = round(((amount_stellar - amount_market) / amount_market) * 100, 2);
      setPriceImpact(priceImpact);
    }
  }, [toAmount, rate, marketPrice, sourceAmount]);

  useEffect(() => {
    //fetching data needed for advance swap card
    async function fetchOffers() {
      try {
        setIsFetchingOffers(true);
        const from = getAssetDetails(asset);
        const to = getAssetDetails(toAsset);
        const sellingResult = await stellar.getBidOffers(from, to);
        if (sellingResult) {
          setSellingPrice(stellar.destructOfferPrice(sellingResult));
        }
        const buyingResult = await stellar.getBidOffers(to, from);
        if (buyingResult) {
          setBuyingPrice(stellar.destructOfferPrice(buyingResult));
        }
        setIsFetchingOffers(false);
      } catch (error) {
        setIsFetchingOffers(false);
        setToasterText(toString(error));
      }
    }
    async function fetchLiquidityPools() {
      try {
        setIsFetchingLiquidityPools(true);
        const liquidityPools = await stellar.getLiquidityPools([getAssetDetails(asset), getAssetDetails(toAsset)]);
        if (liquidityPools) {
          setReserves(get(first(get(liquidityPools, "records")), "reserves", []));
        }
        setIsFetchingLiquidityPools(false);
      } catch (error) {
        setIsFetchingLiquidityPools(false);
        setToasterText(toString(error));
      }
    }

    if (toAsset && asset && isDetailsCardVisible) {
      fetchOffers();
      fetchLiquidityPools();
    }
  }, [toAsset, asset, isDetailsCardVisible, setToasterText]);

  useEffect(() => {
    if (balanceObj) {
      const { balance, selling_liabilities } = balanceObj;
      if (balance) {
        setBalance(balance - selling_liabilities);
      } else {
        setBalance(0);
      }
    }
  }, [balanceObj]);

  const fetchMarketPrice = async () => {
    if (toAsset && sourceAmount) {
      const fromAssetCode = asset.code === "CLPX" ? toAsset.code : asset.code;
      const toAssetCode = asset.code === "CLPX" ? asset.code : toAsset.code;
      const fromAssetsIds = [
        getCurrencyIdBySymbol(marketCap, toLower(coinGecko.convertIntoGeckoCoinSupportedSymbol(fromAssetCode))),
      ];

      const toAssetsCodes = [toLower(coinGecko.convertIntoGeckoCoinSupportedVsCurrencies(toAssetCode))];
      setIsLoading(true);

      try {
        const data = await coinGecko.getMarketPrice({
          fromAssetsIds,
          toAssetsCodes,
        });

        setIsLoading(false);
        if (data) {
          const coinGeckoSupportedCode = toLower(coinGecko.convertIntoGeckoCoinSupportedVsCurrencies(toAssetCode));
          const foundObj = find(data, coinGeckoSupportedCode);
          const result = get(foundObj, coinGeckoSupportedCode, "");
          const marketPrice = asset.code === "CLPX" ? 100 / result : result;
          const calculatedMarketPrice = coinGecko.calculateMarketPrice(marketPrice, toAssetCode, fromAssetCode);
          setMarketPrice(calculatedMarketPrice);
          return calculatedMarketPrice;
        }
      } catch (error) {
        setMarketPrice("NA");
        setIsLoading(false);
        // setToasterText(() => T("messages.fetching_market_price_error"))
      }
    }
  };

  const doPaymentStrictSend = async (amountToSend) => {
    if (toAsset && amountToSend) {
      const { minAmount, path } = await stellar.calculateSendEstimatedAndPath(
        amountToSend,
        getAssetDetails(asset),
        getAssetDetails(toAsset)
      );

      setMinAmount(minAmount);
      setToAmount(minAmount);
      setPath(path);
      setIsDetailsCardVisible(true);
    } else {
      setToAmount(0);
    }
  };
  const doPaymentStrictReceive = async (amountToReceive) => {
    if (toAsset && amountToReceive) {
      const { minAmount } = await stellar.calculateReceiveEstimatedAndPath(
        amountToReceive,
        getAssetDetails(asset),
        getAssetDetails(toAsset)
      );
      setMinAmount(amountToReceive);
      setSourceAmount(minAmount);
      setIsDetailsCardVisible(true);
    } else {
      setSourceAmount(0);
    }
  };

  const onHide = () => {
    setToAsset("");
    setToAmount("");
    setSourceAmount("");
    setIsWarningModalVisible(false);
    setIsDetailsCardVisible(false);
    setIsSuperSwapSelected(false);
    toggleModal();
  };

  useEffect(() => {
    if (toAsset) {
      if (lastChange === "from" && sourceAmount) {
        doPaymentStrictSend(sourceAmount);
      } else if (lastChange === "to" && toAmount) {
        doPaymentStrictReceive(toAmount);
      }
      fetchMarketPrice();
    }
  }, [toAsset]);

  useEffect(() => {
    if (lastChange !== "to") {
      doPaymentStrictSend(sourceAmount);
      setLastChange("from");
      fetchMarketPrice();
    }
  }, [sourceAmount]);

  useEffect(() => {
    setCalculatedMinReceived(
      (parseFloat(minAmount) - parseFloat(calculatePercentage(minAmount, slippageTolerancePercentage))).toFixed(7)
    );
  }, [minAmount, slippageTolerancePercentage]);

  const handleOnSwap = async () => {
    try {
      console.log(`toMinAmount: ${calculatedMinReceived}`);
      setIsLoading(true);
      console.log("calling doTrade()");

      const response = await doTrade({
        wallet: connectedWallet,
        walletPubkey: pubKey,
        network: toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
        fromAsset: get(asset, "code"),
        fromIssuer: get(asset, "issuer"),
        toAsset: get(toAsset, "code"),
        toIssuer: get(toAsset, "issuer"),
        fromAmount: sourceAmount,
        toMinAmount: calculatedMinReceived,
        destPubkey: pubKey,
        setIsSigningWithLedger,
      });

      //On Success
      if (asset?.isOwnAsset || toAsset?.isOwnAsset) {
        ga.event({
          action: "purchase",
          params: {
            transaction_id: response?.id,
            sell: get(asset, "code"),
            buy: get(toAsset, "code"),
          },
        });
      }
      ga.event({
        action: "swap",
        params: {
          event_label: "Swap Successful",
        },
      });
      setIsLoading(false);
      setRefreshBalances(!refreshBalances);
      setIsSuccess(true);

      setToasterText(
        makeSwapSuccessMessage({
          txId: response?.id,
          sourceAmount,
          calculatedMinReceived,
          fromAssetCode: get(asset, "code"),
          toAssetCode: get(toAsset, "code"),
          swap_successful_translation,
          you_swapped_translation,
          for_translation,
        })
      );
      onHide();
    } catch (error) {
      fetchBalance();
      setToasterText(toString(error));
      setIsLoading(false);
    }
  };

  const onSwapBtnClick = async () => {
    if (sourceAmount && toAmount && toAsset) {
      if (isSuperSwapSelected) {
        setIsSuperSwapModalVisible(true);
        return;
      }
      if (toNumber(sourceAmount) > toNumber(balance)) {
        setToasterText("messages.from_amount_greater_than_balance");
        return;
      }

      const result = await fetchMarketPrice();
      if (result && toNumber(result) > toNumber(minAmount)) {
        const stallerDexPrice = toNumber(minAmount) / toNumber(sourceAmount);
        var percentageDiff = calculatePercentageDiff(stallerDexPrice, result);
        if (percentageDiff > 2) {
          setPercentageDiff(percentageDiff);
          setIsWarningModalVisible(true);
        } else {
          handleOnSwap();
        }
      } else {
        handleOnSwap();
      }
    }
  };

  return {
    asset,
    path,
    lastChange,
    isDetailsCardVisible,
    toAsset,
    toAmount,
    sourceAmount,
    minAmount,
    isLoading,
    isWarningModalVisible,
    marketPrice,
    percentageDiff,
    slippageTolerancePercentage,
    calculatedMinReceived,
    balance,
    isSigningWithLedger,
    setToasterText,
    isFetchingBalance,
    isFetchingTrades,
    lastPrice,
    priceImpact,
    sellingPrice,
    buyingPrice,
    reserves,
    isFetchingLiquidityPools,
    isFetchingOffers,
    isSuperSwapSelected,
    isSuperSwapModalVisible,
    rate,
    subentry,
    setIsSuperSwapModalVisible,
    setIsSuperSwapSelected,
    setRate,
    doPaymentStrictSend,
    setSlippageTolerancePercentage,
    doPaymentStrictReceive,
    onHide,
    handleOnSwap,
    onSwapBtnClick,
    setLastChange,
    setIsDetailsCardVisible,
    setToAsset,
    setToAmount,
    setSourceAmount,
    setMinAmount,
    setIsLoading,
    setIsWarningModalVisible,
    setMarketPrice,
    setPercentageDiff,
    fetchMarketPrice,
  };
};

export default useSwapModalBusinessLogic;
