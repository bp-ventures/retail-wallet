import { first, get, round, toLower, toString } from "lodash";
import { useContext, useEffect, useState } from "react";
import { AuthContext, GlobalStateContext, ToasterContext } from "../contexts";
import { doTrade, getAssetDetails } from "../helpers";
import { getLiquidityPools } from "../stellar";
import { destructAssetCodeAndIssuer, makeSwapSuccessMessage } from "../utils";
import * as ga from "../lib/helpers/ga";
import { T } from "../components/translation";
import useFetchBalance from "./useFetchBalance";
import { SuperSwapOrderTypes } from "../consts";

const useSuperSwapModalBusinessLogic = ({
  data,
  toggleModal,
  pathPaymentPrice,
  fromAmount,
  toAsset,
  isModalVisible,
  onHideSwapModal,
  coinGeckoPrice,
}) => {
  const asset = get(data, "asset", "");
  const [liquidityPoolPrice, setLiquidityPoolPrice] = useState(0);
  const [isFetchingLiquidityPoolPrice, setIsFetchingLiquidityPoolPrice] = useState(false);
  const { connectedWallet, pubKey, refreshBalances, setRefreshBalances } = useContext(AuthContext);
  const { isSigningWithLedger, setIsSigningWithLedger } = useContext(GlobalStateContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const [isSwapInProgress, setIsSwapInProgress] = useState(false);
  const [orderType, setOrderType] = useState("");
  const swap_successful_translation = T("messages.swap_successful");
  const you_swapped_translation = T("messages.you_swapped");
  const for_translation = T("messages.for");
  useEffect(() => {
    if (pathPaymentPrice && coinGeckoPrice) {
      if (coinGeckoPrice > pathPaymentPrice) {
        setOrderType(SuperSwapOrderTypes.PATH_PAYMENT);
      } else {
        setOrderType("");
      }
    } else {
      setOrderType("");
    }
  }, [pathPaymentPrice, coinGeckoPrice]);

  const { fetchBalance } = useFetchBalance({
    dependencyArray: [isModalVisible, asset],
    selectedAsset: asset,
  });

  useEffect(() => {
    async function fetchLPPrice() {
      setIsFetchingLiquidityPoolPrice(true);
      const sellingAsset = getAssetDetails(asset);
      const buyingAsset = getAssetDetails(toAsset);
      const result = await getLiquidityPools([sellingAsset, buyingAsset]);
      const reserves = get(first(get(result, "records", [])), "reserves", {});
      const responseAsset1 = reserves[0];
      const { code: responseAsset1Code } = destructAssetCodeAndIssuer(get(responseAsset1, "asset", ""));
      const rate = get(reserves[0], "amount", 0) / get(reserves[1], "amount", 0);
      const rate_r = get(reserves[1], "amount", 0) / get(reserves[0], "amount", 0);
      if (responseAsset1Code === sellingAsset.code) {
        //sequence is Same
        setLiquidityPoolPrice(rate_r);
      } else {
        setLiquidityPoolPrice(rate);
      }
      setIsFetchingLiquidityPoolPrice(false);
    }
    if (asset && isModalVisible && toAsset) {
      fetchLPPrice();
    }
  }, [asset, toAsset, isModalVisible]);

  const handleSuperSwap = async () => {
    try {
      setIsSwapInProgress(true);
      const response = await doTrade({
        wallet: connectedWallet,
        walletPubkey: pubKey,
        network: toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
        fromAsset: get(asset, "code"),
        fromIssuer: get(asset, "issuer"),
        toAsset: get(toAsset, "code"),
        toIssuer: get(toAsset, "issuer"),
        fromAmount,
        toMinAmount: toString(round(fromAmount * pathPaymentPrice, 7)),
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
      setRefreshBalances(!refreshBalances);
      setIsSuccess(true);

      setToasterText(
        makeSwapSuccessMessage({
          txId: response?.id,
          sourceAmount: fromAmount,
          calculatedMinReceived: toString(round(fromAmount * pathPaymentPrice, 7)),
          fromAssetCode: get(asset, "code"),
          toAssetCode: get(toAsset, "code"),
          swap_successful_translation,
          you_swapped_translation,
          for_translation,
        })
      );
      setIsSwapInProgress(false);
      toggleModal();
      onHideSwapModal();
    } catch (error) {
      setIsSwapInProgress(false);
      fetchBalance();
      setToasterText(toString(error));
    }
  };

  return {
    asset,
    liquidityPoolPrice,
    isFetchingLiquidityPoolPrice,
    isSigningWithLedger,
    isSwapInProgress,
    orderType,
    handleSuperSwap,
  };
};

export default useSuperSwapModalBusinessLogic;
