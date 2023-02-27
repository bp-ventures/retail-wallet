import { round } from "lodash";
import React from "react";
import { Col, Container, Modal } from "react-bootstrap";
import { SuperSwapOrderTypes } from "../../../consts";
import { useSuperSwapModalBusinessLogic } from "../../../hooks";
import { LoadingButton } from "../../buttons";
import { T } from "../../translation";
import { PricesCard, RenderPath } from "./components";

const SuperSwapModal = ({
  isModalVisible,
  coinGeckoPrice,
  pathPaymentPrice,
  sourceAmount,
  toAmount,
  fromAmount,
  toggleModal,
  data,
  path,
  toAsset,
  onHideSwapModal,
  buyingPrice,
}) => {
  const {
    handleSuperSwap,
    isSwapInProgress,
    isSigningWithLedger,
    asset,
    liquidityPoolPrice,
    isFetchingLiquidityPoolPrice,
    orderType,
  } = useSuperSwapModalBusinessLogic({
    toggleModal,
    onHideSwapModal,
    fromAmount,
    pathPaymentPrice,
    data,
    toAsset,
    isModalVisible,
    coinGeckoPrice,
  });

  return (
    <Modal centered show={isModalVisible} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <T>
            SuperSwap <small className="text-danger">(Beta)</small>
          </T>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <PricesCard
            fromAmount={fromAmount}
            coinGeckoPrice={round(coinGeckoPrice, 7)}
            sourceAmount={sourceAmount}
            toAmount={toAmount}
            toAsset={toAsset}
            asset={asset}
            pathPaymentPrice={pathPaymentPrice}
            liquidityPoolPrice={liquidityPoolPrice}
            isFetchingLiquidityPoolPrice={isFetchingLiquidityPoolPrice}
            buyingPrice={buyingPrice}
          />

          {orderType === SuperSwapOrderTypes.PATH_PAYMENT && (
            <RenderPath
              path={path}
              sendingAsset={asset}
              receivingAsset={toAsset}
            />
          )}
          <Col xs="12" className="my-2">
            <LoadingButton
              variant="primary"
              className="w-100 mt-3"
              disabled={orderType !== SuperSwapOrderTypes.PATH_PAYMENT}
              onClick={handleSuperSwap}
              isLoading={isSwapInProgress}
              loadingText={
                isSigningWithLedger && "messages.confirm_on_hardware_wallet"
              }
            >
              <T>Confirm</T>
            </LoadingButton>
          </Col>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default SuperSwapModal;
