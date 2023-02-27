import React, { useState } from "react";
import { useSortBy, useTable } from "react-table";
import CommonTableUI from "../CommonTableUI";
import useTableColumns from "./useTableColumns";
import useTableData from "./useTableData";
import classnames from "classnames";
import { isEmpty } from "lodash";
import { Spinner } from "react-bootstrap";
import { T } from "../../translation";

const TransactionsTable = ({
  isShowTransactions,
  selectedAsset,
  selectedAnchor,
}) => {
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [data] = useTableData({
    isShowTransactions,
    selectedAsset,
    setIsTransactionsLoading,
    selectedAnchor,
  });
  const [columns] = useTableColumns({ selectedAsset });
  const tableInstance = useTable({ columns, data }, useSortBy);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  if (isTransactionsLoading)
    return (
      <Spinner
        className="d-flex mx-auto color-primary"
        animation="border"
        role="status"
        size="lg"
      />
    );
  if (isShowTransactions && isEmpty(data))
    return (
      <h5 className="text-center mt-1">
        <T>transactions.no_transactions</T>
      </h5>
    );
  return (
    <CommonTableUI
      className={classnames({
        "d-none": isEmpty(data),
      })}
      getTableProps={getTableProps}
      getTableBodyProps={getTableBodyProps}
      headerGroups={headerGroups}
      rows={rows}
      prepareRow={prepareRow}
    />
  );
};

export default TransactionsTable;
