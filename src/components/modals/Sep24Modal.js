import classnames from "classnames";
import { capitalize, round, toLower, toNumber } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { AuthContext, GlobalStateContext, ToasterContext } from "../../contexts";
import { useFetchBalance } from "../../hooks/";
import { handleSep24DepositAsset } from "../../stellar/";
import { handleSep24WithdrawAsset } from "../../stellar/sep24";
import { LoadingButton } from "../buttons";
import { AvailableBalanceCard } from "../cards";
import { T } from "../translation";

const Sep24Modal = ({ isModalVisible, selectedAnchor, selectedAsset = {}, isDeposit, toggleModal }) => {
  const { pubKey, connectedWallet } = useContext(AuthContext);
  const { setToasterText } = useContext(ToasterContext);
  const { setIsSigningWithLedger, isSigningWithLedger } = useContext(GlobalStateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const { isFetchingBalance, balanceObj } = useFetchBalance({
    dependencyArray: [isModalVisible, selectedAsset, !isDeposit],
    selectedAsset,
  });

  const onSubmit = async () => {
    setIsLoading(true);
    if (isDeposit) {
      await handleSep24DepositAsset({
        selectedAnchor,
        asset: selectedAsset,
        pubKey,
        connectedWallet,
        setIsLoading,
        onHideModal,
        setToasterText,
        setIsSigningWithLedger,
      });
    } else {
      navigator.clipboard.writeText(availableBalance);
      await handleSep24WithdrawAsset({
        selectedAnchor,
        asset: selectedAsset,
        pubKey,
        connectedWallet,
        setIsLoading,
        onHideModal,
        setToasterText,
        setIsSigningWithLedger,
      });
    }
  };

  useEffect(() => {
    if (balanceObj) {
      const { balance } = balanceObj;
      if (balance) {
        setAvailableBalance(round(toNumber(balance), 7));
      } else {
        setAvailableBalance(0);
      }
    }
  }, [balanceObj]);

  const onHideModal = () => {
    setIsLoading(false);
    toggleModal();
  };

  const actionType = isDeposit ? toLower(T("general.deposit")) : toLower(T("general.withdraw"));
  const { code = "" } = selectedAsset;
  return (
    <Modal centered show={isModalVisible} onHide={onHideModal}>
      <Modal.Header closeButton>
        {capitalize(actionType)} {code}
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs="12">
            <h6
              className={classnames({
                "mb-3": isDeposit,
              })}
            >
              <div
                className={classnames({
                  "d-none": isDeposit,
                })}
              >
                <T>messages.sep_24_withdraw_modal_message</T>
                <br />
                <br />
                <AvailableBalanceCard isLoading={isFetchingBalance} balance={availableBalance} assetCode={code} />
                <br />
                <br />
              </div>
              {isDeposit ? (
                <T>messages.authenticate_and_start_deposit_of</T>
              ) : (
                <>
                  <T>transactions.copy_balance_and_start</T>{" "}
                  {isDeposit ? (
                    actionType
                  ) : (
                    <>
                      {`${actionType} `}
                      <T>transactions.of</T>
                    </>
                  )}{" "}
                </>
              )}
              {code}?
            </h6>
          </Col>
          <Col xs="12" className="d-flex justify-content-end ">
            <LoadingButton
              variant="primary"
              onClick={onSubmit}
              className="me-2"
              isLoading={isLoading}
              loadingText={isSigningWithLedger && "messages.confirm_on_hardware_wallet"}
            >
              <T>transactions.start</T>
            </LoadingButton>
            <Button variant="outline-primary" onClick={onHideModal} className="action-btn">
              <T>general.cancel</T>
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Sep24Modal;
