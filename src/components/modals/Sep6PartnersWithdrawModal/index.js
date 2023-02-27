import classnames from "classnames";
import { round, toNumber } from "lodash";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Modal, Row } from "react-bootstrap";
import useFetchBalance from "../../../hooks/useFetchBalance";
import { openLinkInNewTab } from "../../../utils";
import { LinkWithIconCard } from "../../cards";
import { T } from "../../translation";
import Sep6PartnersWithdrawForm from "./Form";

const Sep6PartnersWithdrawModal = ({
  isModalVisible,
  isSep6WithdrawLoading,
  toggleModal,
  handleTransactionsScreenAction,
  selectedAsset,
  setIsSep6WithdrawLoading,
  selectedAnchor,
}) => {
  const [amount, setAmount] = useState(0);
  const [destAddress, setDestAddress] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isFetchingFee, setIsFetchingFee] = useState(false);
  const { isFetchingBalance, balanceObj } = useFetchBalance({
    dependencyArray: [isModalVisible, selectedAsset],
    selectedAsset,
  });

  useEffect(() => {
    if (balanceObj) {
      const { balance, selling_liabilities } = balanceObj;
      if (balance) {
        setAvailableBalance(
          round(toNumber(balance) - toNumber(selling_liabilities), 7)
        );
      } else {
        setAvailableBalance(0);
      }
    }
  }, [balanceObj]);

  const resetAndToggleModal = () => {
    setAmount(0);
    setDestAddress();
    toggleModal();
  };

  return (
    <Modal centered show={isModalVisible} onHide={resetAndToggleModal}>
      <Modal.Header closeButton>
        <div className="d-flex flex-row align-items-center w-100">
          <div
            className={classnames("d-flex  position-relative  asset-icon")}
            style={{ height: 40, width: 40 }}
          >
            <Image
              alt={selectedAnchor?.name}
              src={selectedAnchor?.icon}
              layout="fill"
            />
          </div>
          <div className="ms-3">
            <Modal.Title>{selectedAnchor?.name}</Modal.Title>
            <small>
              <LinkWithIconCard
                onClick={() => openLinkInNewTab(selectedAnchor?.url)}
              >
                {selectedAnchor?.url}
              </LinkWithIconCard>
            </small>
          </div>
          <Modal.Title className="me-2 modal-title ms-auto">
            <T>general.withdraw</T>
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Sep6PartnersWithdrawForm
            selectedAnchor={selectedAnchor}
            isFetchingBalance={isFetchingBalance}
            isFetchingFee={isFetchingFee}
            availableBalance={availableBalance}
            assetInfo={{}}
            assetCode={selectedAsset?.code}
            assetIssuer={selectedAsset?.issuer}
            isPaymentCall={true}
            amount={amount}
            destAddress={destAddress}
            resetAndToggleModal={resetAndToggleModal}
            setAmount={setAmount}
            setDestAddress={setDestAddress}
            isSep6WithdrawLoading={isSep6WithdrawLoading}
            setIsSep6WithdrawLoading={setIsSep6WithdrawLoading}
            handleTransactionsScreenAction={handleTransactionsScreenAction}
          />
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Sep6PartnersWithdrawModal;
