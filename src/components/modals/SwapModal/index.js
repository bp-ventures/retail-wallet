import { faLongArrowAltDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { get, round } from "lodash";
import React from "react";
import { Col, Container, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import { TradeProtectionWarningModal } from "..";
import useSwapModalBusinessLogic from "../../../hooks/useSwapModalBusinessLogic";
import { AssetCard, AvailableBalanceCard } from "../../cards";
import { LoadingButton } from "../../buttons";
import { AssetSelectionDropDown } from "../../dropdowns";
import { T } from "../../translation";
import { DetailsCard, RenderSwapRate } from "./components";
import SuperSwapModal from "../SuperSwapModal";
import * as stellar from "../../../stellar";

const SwapModal = ({ isSwapModalVisible, toggleModal, data }) => {
  const {
    asset,
    isDetailsCardVisible,
    toAsset,
    toAmount,
    sourceAmount,
    minAmount,
    isLoading,
    isWarningModalVisible,
    marketPrice,
    percentageDiff,
    slippageTolerancePercentage,
    calculatedMinReceived,
    balance,
    isSigningWithLedger,
    isFetchingBalance,
    isFetchingTrades,
    priceImpact,
    sellingPrice,
    buyingPrice,
    reserves,
    isFetchingLiquidityPools,
    isFetchingOffers,
    isSuperSwapSelected,
    isSuperSwapModalVisible,
    rate,
    path,
    subentry,
    setIsSuperSwapModalVisible,
    setIsSuperSwapSelected,
    setRate,
    setSlippageTolerancePercentage,
    doPaymentStrictReceive,
    onHide,
    handleOnSwap,
    onSwapBtnClick,
    setLastChange,
    setToAsset,
    setToAmount,
    setSourceAmount,
    setIsWarningModalVisible,
  } = useSwapModalBusinessLogic({
    toggleModal,
    data,
    isSwapModalVisible,
  });

  return (
    <>
      <Modal
        className={classnames({
          invisible: isSuperSwapModalVisible,
        })}
        centered
        show={isSwapModalVisible}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <T>general.swap_assets</T>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs="9">
                <Form.Label className="text-muted">
                  <T>general.from</T>
                </Form.Label>
                <InputGroup className="mb-2">
                  <FormControl
                    onChange={(e) => {
                      setLastChange("from");
                      setSourceAmount(e.target.value);
                    }}
                    value={sourceAmount}
                    type="number"
                    placeholder="0"
                  />
                </InputGroup>
                <AvailableBalanceCard
                  isLoading={isFetchingBalance}
                  balance={
                    get(asset, "code") === "XLM" ? round(stellar.calculateMaxXLM(balance, subentry), 7) : balance
                  }
                  onSelect={setSourceAmount}
                  assetCode={get(asset, "code")}
                  subentry={subentry}
                />
              </Col>
              <Col xs="3" className="d-flex align-items-center p-0 p-md-2">
                <AssetCard value={asset} valueClassName="ps-1" imageContainerClassName="me-1" />
              </Col>
            </Row>
            <Row className=" mb-2">
              <Col xs="12">
                <FontAwesomeIcon className="sort-icon icon-sm ms-2 " icon={faLongArrowAltDown} />
              </Col>
            </Row>
            <Row>
              <Col xs="9">
                <Form.Label className="text-muted">
                  <T>general.to</T> (<T>swapModal.estimated_amount</T>){" "}
                </Form.Label>
                <InputGroup className="mb-2">
                  <FormControl
                    onChange={(e) => {
                      setToAmount(e.target.value);
                      setLastChange("to");
                      doPaymentStrictReceive(e.target.value);
                    }}
                    value={toAmount}
                    type="number"
                    placeholder="0"
                  />
                </InputGroup>
              </Col>
              <Col
                xs="3"
                className={classnames("d-flex mt-3 cursor-pointer p-0 p-md-2", {
                  "align-items-center": !toAsset,
                  "align-items-center align-items-md-end mt-md-0 ": toAsset,
                })}
              >
                <AssetSelectionDropDown
                  selectedAsset={toAsset}
                  displayBalance
                  excludeAssets={[asset.code]}
                  onSelect={(value) => {
                    setToAsset(value);
                  }}
                />
              </Col>
              <Col xs="12">
                <RenderSwapRate setRate={setRate} fromAsset={asset} toAsset={toAsset} />
              </Col>
              <Col xs="12 mt-3">
                <Row>
                  <Col xs="6">
                    <Form.Label className="text-muted">
                      <T>swapModal.slippage_tolerance</T>
                    </Form.Label>
                  </Col>
                  <Col xs="6 d-flex text-center">
                    <Form.Range
                      min="0"
                      max="5"
                      step="0.10"
                      value={slippageTolerancePercentage}
                      disabled={isLoading}
                      className="custom-range"
                      onChange={(e) => setSlippageTolerancePercentage(e.target.value)}
                    />
                    <small className="ms-2 slippage-tolerance">{slippageTolerancePercentage}%</small>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs="12" className="my-2">
                <LoadingButton
                  variant="primary"
                  className="w-100 mt-3"
                  disabled={!sourceAmount || !toAmount || !toAsset}
                  onClick={onSwapBtnClick}
                  isLoading={isLoading}
                  loadingText={isSigningWithLedger && "messages.confirm_on_hardware_wallet"}
                >
                  <T>general.swap</T>
                </LoadingButton>
              </Col>
            </Row>
            <DetailsCard
              isDetailsCardVisible={isDetailsCardVisible}
              marketPrice={marketPrice}
              stellarPrice={minAmount / sourceAmount}
              minAmount={minAmount}
              calculatedMinReceived={calculatedMinReceived}
              toAmount={toAmount}
              isFetchingTrades={isFetchingTrades}
              priceImpact={priceImpact}
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

            <TradeProtectionWarningModal
              marketPrice={marketPrice}
              stellarPrice={minAmount / sourceAmount}
              percentageDiff={percentageDiff}
              isWarningModalVisible={isWarningModalVisible}
              onHide={() => setIsWarningModalVisible(false)}
              onConfirm={handleOnSwap}
            />
          </Container>
        </Modal.Body>
      </Modal>

      <SuperSwapModal
        data={data}
        toAsset={toAsset}
        path={path}
        coinGeckoPrice={marketPrice}
        fromAmount={sourceAmount}
        toAmount={toAmount}
        pathPaymentPrice={rate}
        buyingPrice={buyingPrice}
        isModalVisible={isSuperSwapModalVisible}
        onHideSwapModal={onHide}
        toggleModal={() => setIsSuperSwapModalVisible(!isSuperSwapModalVisible)}
      />
    </>
  );
};

export default SwapModal;
