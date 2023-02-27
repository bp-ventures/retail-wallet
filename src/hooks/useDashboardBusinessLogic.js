import { find, get, sumBy, toNumber } from "lodash";
import { useContext, useEffect, useState } from "react";
import useDashboardLendingTableData from "../components/tables/DashboardLendingTable/useTableData";
import useDashboardTradingTableData from "../components/tables/DashboardTradingTable/useTableData";
import { AuthContext } from "../contexts";
import { calculateHealthFactor } from "../utils";

const useDashboardBusinessLogic = ({}) => {
  const [
    totalClaimableBalanceInUSDC,
    setTotalClaimableBalanceInUSDC,
  ] = useState(0);
  const [totalValueInUSDC, setTotalValueInUSDC] = useState(0);
  const {
    isLoggedIn,
    valuesInUSDC,
    claimableBalanceInUSDC,
    claimableBalance,
    balances,
  } = useContext(AuthContext);
  const [totalHealthFactor, setTotalHealthFactor] = useState(0);
  const { data: lendingTableData } = useDashboardLendingTableData({});
  const { data: tradingTableData } = useDashboardTradingTableData({});
  const [selectedRow, setSelectedRow] = useState({});
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false);
  const [isAddAssetModalVisible, setIsAddAssetModalVisible] = useState(false);
  const [tabKey, setTabKey] = useState("trade");
  const getValueInUSDC = (code) =>
    get(find(valuesInUSDC, { code }), "value_in_usdc", 0);
  const getClaimableBalanceInUSDC = (code) =>
    get(find(claimableBalanceInUSDC, { code: code }), "value_in_usdc", 0);
  useEffect(() => {
    setTotalHealthFactor(calculateHealthFactor(balances, claimableBalance));
  }, [balances, claimableBalance]);

  useEffect(() => {
    setTotalClaimableBalanceInUSDC(
      sumBy(claimableBalanceInUSDC, ({ value_in_usdc }) =>
        toNumber(value_in_usdc)
      )
    );
    setTotalValueInUSDC(
      sumBy(valuesInUSDC, ({ value_in_usdc }) => toNumber(value_in_usdc))
    );
  }, [claimableBalanceInUSDC, valuesInUSDC]);

  return {
    isLoggedIn,
    totalHealthFactor,
    totalValueInUSDC,
    totalClaimableBalanceInUSDC,
    lendingTableData,
    tradingTableData,
    selectedRow,
    isLockModalVisible,
    isSwapModalVisible,
    isAddAssetModalVisible,
    setIsAddAssetModalVisible,
    getClaimableBalanceInUSDC,
    getValueInUSDC,
    setIsLockModalVisible,
    setSelectedRow,
    setIsSwapModalVisible,
    tabKey,
    setTabKey,
  };
};

export default useDashboardBusinessLogic;
