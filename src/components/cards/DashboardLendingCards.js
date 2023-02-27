import { map } from "lodash";
import { DashboardLendingCard } from ".";
import React from "react";

const DashboardLendingCards = ({
  data,
  setSelectedRow,
  setIsLockModalVisible,
  setIsConnectModalVisible,
  setIsSwapModalVisible,
}) => {
  return map(data, (obj) => (
    <DashboardLendingCard
      setIsLockModalVisible={setIsLockModalVisible}
      setIsConnectModalVisible={setIsConnectModalVisible}
      setIsSwapModalVisible={setIsSwapModalVisible}
      setSelectedRow={setSelectedRow}
      data={obj}
    />
  ));
};

export default DashboardLendingCards;
