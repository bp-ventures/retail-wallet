import classnames from "classnames";
import { round } from "lodash";
import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { GlobalStateContext } from "../../../../contexts";
import { T } from "../../../translation";
import { RenderDetailsCardRow } from "../../components";

const PricesCard = ({
  fromAmount,
  isFetchingLiquidityPoolPrice,
  coinGeckoPrice,
  liquidityPoolPrice,
  pathPaymentPrice,
  toAmount,
  asset,
  buyingPrice,
  toAsset,
}) => {
  const { isDarkTheme } = useContext(GlobalStateContext);
  return (
    <>
      <Card
        className={classnames("my-3 p-3 rounded-3", {
          "bg-black bg-opacity-75 text-white-50": isDarkTheme,
        })}
      >
        <RenderDetailsCardRow
          label={<T>superSwapModal.selling_amount</T>}
          value={`${fromAmount} ${asset.code}`}
          toolTipText={<T>superSwapModal.the_amount_you_are_selling</T>}
        />
        <RenderDetailsCardRow
          label={<T>superSwapModal.buying_asset</T>}
          value={toAsset.code}
          toolTipText={<T>superSwapModal.the_asset_you_are_buying</T>}
        />
      </Card>
      <Card
        className={classnames("my-3 p-3 rounded-3", {
          "bg-black bg-opacity-75 text-white-50": isDarkTheme,
        })}
      >
        <p className="text-center">
          <T>superSwapModal.prices</T>
        </p>

        <RenderDetailsCardRow
          borderTop
          isLoading={isFetchingLiquidityPoolPrice}
          label="LiquidityPool (A)"
          value={`<small>Price:</small> ${round(
            liquidityPoolPrice,
            7
          )} <br/> <small>Receive:</small> ${round(
            liquidityPoolPrice * fromAmount,
            7
          )}`}
          toolTipText={<T>Liquidity Pool Price</T>}
        />
        <RenderDetailsCardRow
          borderTop
          label={<T>Limit Order Book (B)</T>}
          value={`<small>Price:</small> ${
            buyingPrice ? round(1 / buyingPrice, 7) : "NA"
          }
          <br/>
          <small>Receive:</small> ${round((1 / buyingPrice) * fromAmount, 7)}`}
          toolTipText={<T>superSwapModal.best_price</T>}
        />

        <RenderDetailsCardRow
          borderTop
          label={<T>Market Price (Coingecko) (C)</T>}
          value={`<small>Price:</small> ${coinGeckoPrice} <br/> <small>Receive:</small> ${round(
            coinGeckoPrice * fromAmount,
            7
          )}`}
          toolTipText={<T>swapModal.market_price_tooltip</T>}
        />
        <RenderDetailsCardRow
          borderTop
          label={<T>Path Payment (D)</T>}
          value={`<small>Price:</small> ${pathPaymentPrice} <br/> <small>Receive:</small> ${toAmount}`}
          toolTipText={<T>superSwapModal.path_payment</T>}
        />
      </Card>
    </>
  );
};
export default PricesCard;
