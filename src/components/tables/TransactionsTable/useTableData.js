import { find, get, toLower, toString } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import AssetsList from "../../../consts/AssetsList.json";
import {
  AuthContext,
  GlobalStateContext,
  ToasterContext,
} from "../../../contexts";
import { handleGetTransactions } from "../../../stellar/";
import * as stellar from "../../../stellar.ts";

const useTableData = ({
  isShowTransactions,
  selectedAnchor,
  selectedAsset,
  setIsTransactionsLoading,
}) => {
  const [transactions, setTransactions] = useState([]);
  const { isLoggedIn, pubKey, connectedWallet } = useContext(AuthContext);
  const { setIsSigningWithLedger } = useContext(GlobalStateContext);
  const { setToasterText } = useContext(ToasterContext);

  useEffect(() => {
    async function fetchTransactions() {
      setIsTransactionsLoading(true);
      try {
        const hotWalletToQueryTransactions = get(
          selectedAsset,
          "hotWalletToQueryTransactions"
        );
        const isStellar = hotWalletToQueryTransactions
          ? true
          : toLower(selectedAnchor?.name) === "stellar";
        const transactionsList = isStellar
          ? await stellar.getPayments({
              pubKey,
            })
          : await handleGetTransactions(
              find(AssetsList, { code: selectedAsset.code }),
              pubKey,
              connectedWallet,
              setIsSigningWithLedger
            );
        setIsTransactionsLoading(false);
        if (transactionsList) {
          if (isStellar) {
            setTransactions(
              stellar.makeTransactionsList({
                transactionsList,
                selectedAsset,
                pubKey,
                hotWalletToQueryTransactions,
              })
            );
          } else {
            setTransactions(transactionsList);
          }
        }
      } catch (error) {
        setIsTransactionsLoading(false);
        setToasterText(toString(error));
      }
    }

    if (isLoggedIn && pubKey && isShowTransactions) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [
    isLoggedIn,
    pubKey,
    connectedWallet,
    selectedAsset,
    selectedAnchor,
    isShowTransactions,
    setIsTransactionsLoading,
  ]);

  const data = useMemo(() => {
    return transactions;
  }, [transactions]);

  return [data, isLoggedIn];
};

export default useTableData;
