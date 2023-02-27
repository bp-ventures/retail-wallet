import { assign, find, get, toLower, toString } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { getAssetFromApay } from "../api/apay";
import * as stellar from "../stellar";
import { T } from "../components/translation";
import { AuthContext, GlobalStateContext, ToasterContext } from "../contexts";
import { handleSep6ApayDepositAsset, handleSep6ApayWithdrawAsset } from "../stellar/sep6";
import { AssetsList } from "../consts";
import { trustAsset } from "../stellar/sep24/trustAsset";
import { getNetworkConfig } from "../helpers";
import SendAPayment from "../stellar/sendAPayment";
const StellarSdk = require("stellar-sdk");
import * as ga from "../lib/helpers/ga";

const useHandleTransactionScreenActions = ({ setIsConnectModalVisible }) => {
  const { isLoggedIn, pubKey, connectedWallet } = useContext(AuthContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const { setIsSigningWithLedger } = useContext(GlobalStateContext);
  const [isSep6WithdrawLoading, setIsSep6WithdrawLoading] = useState(false);
  const [isSep24ModalVisible, setIsSep24ModalVisible] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [isShowTransactions, setIsShowTransactions] = useState(false);
  const [isSep6DepositModalVisible, setIsSep6DepositModalVisible] = useState(false);
  const [isSep6WithdrawModalVisible, setIsSep6WithdrawModalVisible] = useState(false);
  const [isSep6PartnersWithdrawModalVisible, setIsSep6PartnersWithdrawModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedAnchor, setSelectedAnchor] = useState();
  const [depositResult, setDepositResult] = useState({});
  const [withdrawResult, setWithdrawResult] = useState();
  const [isSep6DepositLoading, setIsSep6DepositLoading] = useState(false);
  const [isShowTransactionsHistory, setIsShowTransactionsHistory] = useState(false);
  const networkConfig = getNetworkConfig();

  useEffect(() => {
    if (selectedAsset) {
      setIsShowTransactionsHistory(get(find(AssetsList, { code: selectedAsset?.code }), "isShowTransactionsHistory"));
    }
  }, [selectedAsset]);

  const handleOnWithdrawBtnClick = () => {
    if (isLoggedIn) {
      if (selectedAsset) {
        if (selectedAnchor.isPartner) {
          setIsSep6PartnersWithdrawModalVisible(true);
          return;
        }
        const stellarAnchorInfo = get(
          find(selectedAsset?.anchors, { name: selectedAnchor?.name }),
          "stellarAnchorInfo"
        );
        if (stellarAnchorInfo) {
          setIsSep6WithdrawModalVisible(true);
          return;
        } else {
          if (get(selectedAsset, "isSep24")) {
            setIsDeposit(false);
            setIsSep24ModalVisible(true);
          } else {
            setIsSep6WithdrawModalVisible(true);
          }
        }
      } else {
        setToasterText(() => T("messages.no_token_selected"));
      }
    } else {
      setIsConnectModalVisible(true);
    }
  };

  const handleTransactionsScreenAction = useCallback(async (actionType, params) => {
    if (isLoggedIn) {
      const stellarAnchorInfo = selectedAnchor?.isPartner
        ? {
            eta: "1",
            min_amount: "",
            fee_fixed: "0.0001",
            assetCode: selectedAsset?.code,
            anchor: "Stellar",
          }
        : get(find(selectedAsset?.anchors, { name: selectedAnchor?.name }), "stellarAnchorInfo");

      if (actionType === "transactions") {
        setIsShowTransactions(!isShowTransactions);
        return;
      } else if (actionType === "deposit") {
        
        setIsDeposit(true);
        if (stellarAnchorInfo) {
          setDepositResult({ how: pubKey, ...stellarAnchorInfo });
          setIsSep6DepositModalVisible(true);
          return;
        }
      } else {
        ga.event({
          action: "withdraw",
          params: {
            event_label: "Withdraw button clicked",
          },
        });
        setIsDeposit(false);
      }

      if (selectedAsset) {
        if (selectedAsset.isSep24) {
          setIsSep24ModalVisible(true);
        } else if (selectedAsset.isSep6) {
          if (actionType === "deposit") {
            try {
              setIsSep6DepositModalVisible(true);
              if (stellarAnchorInfo) return;
              setIsSep6DepositLoading(true);
              try {
                const balances = await stellar.getBalances(pubKey);

                if (!stellar.hasTrust(balances, selectedAsset.code, selectedAsset.issuer)) {
                  await trustAsset({
                    publicKey: pubKey,
                    connectedWallet,
                    networkPassphrase: networkConfig.network,
                    networkUrl: networkConfig.url,
                    untrustedAsset: {
                      assetString: `${selectedAsset.code}:${selectedAsset.issuer}`,
                      assetCode: selectedAsset.code,
                      assetIssuer: selectedAsset.issuer,
                    },
                    setIsSigningWithLedger,
                  });
                }
              } catch (error) {
                if (error instanceof StellarSdk.NotFoundError) {
                  //Account Not found
                  if (!get(find(AssetsList, { code: selectedAsset.code }), "allow_deposit_without_trust")) {
                    throw "messages.account_not_found";
                  }
                } else {
                  throw error;
                }
              }

              const { asset, orgSupportEmail, homeDomain } = await stellar.getAssetAndOrgSupportEmailFromToml(
                selectedAsset
              );
              const result = await handleSep6ApayDepositAsset(asset, pubKey);
              setDepositResult(assign(result, { assetCode: selectedAsset.code, orgSupportEmail, homeDomain }));
              setIsSep6DepositLoading(false);
              ga.event({
                action: "deposit",
                params: {
                  event_label: "Deposit",
                },
              });
            } catch (error) {
              setIsSep6DepositModalVisible(false);
              setIsSep6DepositLoading(false);
              setToasterText(toString(error));
            }
          } else if (actionType === "withdraw") {
            try {
              setIsSep6WithdrawLoading(true);
              const { amount, destAddress } = params;
              const asset = await getAssetFromApay(selectedAsset.code);

              const result = await handleSep6ApayWithdrawAsset(asset, pubKey, amount, destAddress);
              if (result) {
                try {
                  await SendAPayment({
                    asset: selectedAsset,
                    destinationId: result?.account_id,
                    amount: toString(amount),
                    pubKey,
                    connectedWallet,
                    memo: result?.memo,
                    setToasterText,
                    setIsSuccess,
                    setIsSigningWithLedger,
                    setIsSubmitting: setIsSep6WithdrawLoading,
                  });
                  setWithdrawResult(assign(result, { assetCode: selectedAsset.code }));
                  ga.event({
                    action: "withdraw",
                    params: {
                      event_label: "withdraw",
                    },
                  });
                } catch (error) {
                  setToasterText(toString(error));
                  setIsSep6WithdrawLoading(false);
                }
              } else {
                setIsSep6WithdrawLoading(false);
              }
            } catch (error) {
              setIsSep6WithdrawLoading(false);
            }
          }
        }
      } else {
        setToasterText(() => T("messages.no_token_selected"));
      }
    } else {
      setIsConnectModalVisible(true);
    }
  });

  return {
    handleTransactionsScreenAction,
    handleOnWithdrawBtnClick,
    setIsDeposit,
    setIsShowTransactions,
    setIsSep24ModalVisible,
    setIsSep6DepositLoading,
    setDepositResult,
    setIsSep6DepositModalVisible,
    setIsSep6WithdrawLoading,
    setWithdrawResult,
    setIsSep6WithdrawModalVisible,
    setIsSep6PartnersWithdrawModalVisible,
    setSelectedAsset,
    setSelectedAnchor,
    selectedAnchor,
    isDeposit,
    isSep6PartnersWithdrawModalVisible,
    isShowTransactionsHistory,
    withdrawResult,
    isSep6WithdrawLoading,
    setToasterText,
    isSep24ModalVisible,
    isShowTransactions,
    isSep6DepositModalVisible,
    isSep6WithdrawModalVisible,
    selectedAsset,
    depositResult,
    isSep6DepositLoading,
    isLoggedIn,
  };
};

export default useHandleTransactionScreenActions;
