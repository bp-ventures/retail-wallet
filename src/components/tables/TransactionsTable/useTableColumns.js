import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalize, find, get } from "lodash";
import React, { useMemo, useState } from "react";
import { AssetsList } from "../../../consts";
import { CreatePopup } from "../../createPopup";
import { AssetCard, LinkWithIconCard } from "../../cards";
import { T } from "../../translation";

const RenderTypeCell = ({ type }) => (
  <div className="align-items-center d-flex">
    {type === "deposit" ? (
      <FontAwesomeIcon className="icon-sm me-2" icon={faUpload} />
    ) : (
      <FontAwesomeIcon className="icon-sm me-2" icon={faDownload} />
    )}
    {capitalize(type)}
  </div>
);

const useTableColumns = ({ selectedAsset }) => {
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false);
  const TableHeaderCell = ({ children }) => (
    <span className="font-weight-normal cursor-pointer ">{children}</span>
  );

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <TableHeaderCell>
            <T>general.transactions</T>
          </TableHeaderCell>
        ),
        accessor: "asset", // accessor is the "key" in the data
        Cell: ({ value }) => (
          <AssetCard
            value={find(AssetsList, { code: selectedAsset?.code })}
            imageContainerClassName="me-2"
          />
        ),
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>transactions.in_out</T>
          </TableHeaderCell>
        ),
        accessor: "amount_in",
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>transactions.type</T>
          </TableHeaderCell>
        ),
        accessor: "kind",
        Cell: ({ value }) => <RenderTypeCell type={value} />,
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>transactions.status</T>
          </TableHeaderCell>
        ),
        accessor: "status",
        Cell: ({ row: { original }, value }) => (
          <LinkWithIconCard
            onClick={() => CreatePopup(get(original, "more_info_url", ""))}
          >
            {value}
          </LinkWithIconCard>
        ),
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>transactions.date</T>
          </TableHeaderCell>
        ),
        accessor: "started_at",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    [selectedAsset]
  );

  return [
    columns,
    isSwapModalVisible,
    isLockModalVisible,
    setIsLockModalVisible,
    setIsSwapModalVisible,
  ];
};

export default useTableColumns;
