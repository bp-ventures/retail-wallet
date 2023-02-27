import { get, round } from "lodash";
import React, { useContext, useMemo } from "react";
import { Button } from "react-bootstrap";
import { ValueWithUpDownArrows } from "../../";
import { AuthContext } from "../../../contexts";
import {
  makeStallerExpertMarketURL,
  numberWithCommas,
  openLinkInNewTab,
} from "../../../utils";
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
            <T>homePage.market_cap</T>
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
            <T>homePage.last_price</T>
          </TableHeaderCell>
        ),
        accessor: "price_USD",
        Cell: ({ value }) => (value ? numberWithCommas(value) : ""),
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.coingecko_price</T>
          </TableHeaderCell>
        ),
        accessor: "coingecko_price",
        Cell: ({ value }) => (value ? numberWithCommas(value) : ""),
      },
      {
        Header: () => <TableHeaderCell>24h</TableHeaderCell>,
        accessor: "change24h_USD",
        Cell: ({ value }) => <ValueWithUpDownArrows value={value} />,
      },
      {
        Header: () => <TableHeaderCell>1hr</TableHeaderCell>,
        accessor: "coinGeckoPricePercentageChange1h",
        Cell: ({ value }) => (
          <ValueWithUpDownArrows value={round(value, 2)} valuePostFix="%" />
        ),
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>homePage.twenty_four_hr_volume</T>
          </TableHeaderCell>
        ),
        accessor: "volume24h_USD",
      },
      {
        Header: () => (
          <TableHeaderCell>
            <T>general.balance</T>
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
