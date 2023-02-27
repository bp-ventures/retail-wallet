import classnames from "classnames";
import { round } from "lodash";
import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { GlobalStateContext } from "../../../../contexts";
import styles from "../../../../styles/LockModal.module.css";
import { T } from "../../../translation";
import AdvanceSwapCard from "./AdvanceSwapCard";
import { RenderDetailsCardRow } from "../../components";

const DetailsCard = ({
  calculatedMinReceived,
  isDetailsCardVisible,
  stellarPrice,
  marketPrice,
  priceImpact,
  asset,
  toAsset,
  reserves,
  sellingPrice,
  buyingPrice,
  isFetchingLiquidityPools,
  isFetchingOffers,
  isSuperSwapSelected,
  setIsSuperSwapSelected,
}) => {
  const { isDarkTheme } = useContext(GlobalStateContext);
  return (
    <Card
      className={classnames(`mt-3 ${styles["min-time-container"]}`, {
        "d-none": !isDetailsCardVisible,
        "bg-black bg-opacity-75 text-white-50": isDarkTheme,
      })}
    >
      <RenderDetailsCardRow
        label={<T>swapModal.market_price</T>}
        value={round(marketPrice, 7)}
        toolTipText={<T>swapModal.market_price_tooltip</T>}
      />
      <RenderDetailsCardRow
        label={<T>swapModal.stellar_price</T>}
        value={round(stellarPrice, 7)}
        toolTipText={<T>swapModal.stellar_price_tooltip</T>}
      />
      <RenderDetailsCardRow
        label={<T>swapModal.minimum_received</T>}
        value={calculatedMinReceived}
        toolTipText={<T>swapModal.minimum_received_tooltip</T>}
      />

      <RenderDetailsCardRow
        label={<T>swapModal.price_impact</T>}
        // isLoading={isFetchingTrades}
        value={`${priceImpact}%`}
        valueClassName={priceImpact < 0 ? "text-danger" : "text-success"}
        toolTipText={<T>swapModal.price_impact_tooltip</T>}
      />

      <AdvanceSwapCard
        sellingPrice={sellingPrice}
        buyingPrice={buyingPrice}
        reserves={reserves}
        asset={asset}
        toAsset={toAsset}
        isFetchingLiquidityPools={isFetchingLiquidityPools}
        isFetchingOffers={isFetchingOffers}
        isSuperSwapSelected={isSuperSwapSelected}
        setIsSuperSwapSelected={setIsSuperSwapSelected}
      />
    </Card>
  );
};
export default DetailsCard;
