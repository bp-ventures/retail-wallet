import React, { useEffect, useState } from "react";
import { useSortBy, useTable } from "react-table";
import CommonTableUI from "../CommonTableUI";
import useTableColumns from "./useTableColumns";

const DashboardLendingTable = ({
  setIsLockModalVisible,
  setIsConnectModalVisible,
  setIsSwapModalVisible,
  setSelectedRow,
  data,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [columns] = useTableColumns({
    setIsConnectModalVisible,
    setSelectedIndex,
    setIsLockModalVisible,
    setIsSwapModalVisible,
  });

  useEffect(() => {
    setSelectedRow(data[selectedIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const tableInstance = useTable({ columns, data }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;
  return (
    <CommonTableUI
      getTableProps={getTableProps}
      getTableBodyProps={getTableBodyProps}
      headerGroups={headerGroups}
      rows={rows}
      prepareRow={prepareRow}
    />
  );
};

export default DashboardLendingTable;
