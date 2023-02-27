import { get } from "lodash";
import React, { useContext, useMemo } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts";
import { makeStallerExpertMarketURL, openLinkInNewTab } from "../../../utils";
import { AssetCard, LinkWithIconCard } from "../../cards";
import { T } from "../../translation";

const useTableColumns = ({
  setIsConnectModalVisible,
  setSelectedIndex,
  setIsLockModalVisible,
  setIsSwapModalVisible,
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const TableHeaderCell = ({ children }) => (
    <span className="font-weight-normal cursor-pointer ">{children}</span>
  );

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <TableHeaderCell>
            <T>general.asset</T>
          </TableHeaderCell>
        ),
        accessor: "asset", // accessor is the "key" in the data
        Cell: ({ value }) => (
          <AssetCard
            showAssetDescription
            value={value}
            imageContainerClassName="me-3"
          />
        ),
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.market_size</T>
          </TableHeaderCell>
        ),
        accessor: "market_size",
        Cell: ({ row: { original }, value }) => (
          <LinkWithIconCard
            onClick={() =>
              openLinkInNewTab(
                makeStallerExpertMarketURL(get(original, "asset"))
              )
            }
          >
            {value}
          </LinkWithIconCard>
        ),
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.interest_rate</T>
          </TableHeaderCell>
        ),
        accessor: "rate",
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.min_time</T>
          </TableHeaderCell>
        ),
        accessor: "lock_months",
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.locked_amount</T>
          </TableHeaderCell>
        ),
        accessor: "locked_amount",
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.value_in_usdc</T>
          </TableHeaderCell>
        ),
        accessor: "value_in_usdc",
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.unlocked_amount</T>
          </TableHeaderCell>
        ),
        accessor: "unLocked_amount",
      },
      {
        Header: "",
        accessor: "lockable",
        disableSortBy: true,
        Cell: ({ row: { index }, value }) => (
          <div className="d-flex">
            <Button
              onClick={() => {
                setSelectedIndex(index);
                isLoggedIn
                  ? setIsLockModalVisible(true)
                  : setIsConnectModalVisible(true);
              }}
              variant="outline-primary"
              className="btn-sm btn-md-lg action-btn"
              disabled={!value}
            >
              <T>general.lock</T>
            </Button>

            <Button
              onClick={() => {
                setSelectedIndex(index);
                isLoggedIn
                  ? setIsSwapModalVisible(true)
                  : setIsConnectModalVisible(true);
              }}
              variant="outline-primary"
              className="mt-1 mt-lg-0 ms-lg-2 btn-sm btn-md-lg action-btn"
            >
              <T>general.swap</T>
            </Button>
          </div>
        ),
      },
    ],
    [
      isLoggedIn,
      setIsConnectModalVisible,
      setIsLockModalVisible,
      setIsSwapModalVisible,
      setSelectedIndex,
    ]
  );

  return [columns];
};

export default useTableColumns;
