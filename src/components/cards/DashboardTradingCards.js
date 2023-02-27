import { map } from "lodash";
import { DashboardTradingCard } from ".";
import React from "react";

const DashboardTradingCards = ({
  data,
  setSelectedRow,
  setIsLockModalVisible,
  setIsConnectModalVisible,
  setIsSwapModalVisible,
}) => {
  return map(data, (obj) => (
    <DashboardTradingCard
      setIsLockModalVisible={setIsLockModalVisible}
      setIsConnectModalVisible={setIsConnectModalVisible}
      setIsSwapModalVisible={setIsSwapModalVisible}
      setSelectedRow={setSelectedRow}
      data={obj}
    />
  ));
};

export default DashboardTradingCards;
