import { faCopy, faQrcode } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import { find, has, round, toLower } from "lodash";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Container, Modal, Row, Spinner } from "react-bootstrap";
import { GlobalStateContext, ToasterContext } from "../../contexts";
import { useFetchBalances } from "../../hooks";
import * as stellar from "../../stellar";
import { LinkWithIconCard } from "../cards";
import { CreatePopup } from "../createPopup";
import LoadingWrapper from "../LoadingWrapper";
import { AddTrustLineModal } from "../modals";
import { T } from "../translation";
import { ContactSupportText, LabelValue } from "./components/";

const Sep6DepositModal = ({
  isModalVisible,
  toggleModal,
  selectedAsset,
  selectedAnchor,
  depositResult,
  isSep6DepositLoading,
}) => {
  const { how, eta, min_amount, fee_fixed, fee_percent, homeDomain, orgSupportEmail, assetCode } = depositResult;

  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const { isDarkTheme } = useContext(GlobalStateContext);
  const [isAnchorStellar, setIsAnchorStellar] = useState(false);
  const { balances, isFetchingBalances } = useFetchBalances({
    dependencyArray: [isModalVisible],
  });
  const [isAddTrustLineModalVisible, setIsAddTrustLineModalVisible] = useState(false);

  const onHide = () => {
    setIsAddTrustLineModalVisible(false);
    toggleModal();
  };

  useEffect(() => {
    if (isModalVisible) {
      const isAnchorStellar = selectedAnchor?.isPartner
        ? true
        : has(find(selectedAsset?.anchors, { name: selectedAnchor?.name }), "stellarAnchorInfo");
      setIsAnchorStellar(isAnchorStellar);
      if (isAnchorStellar && selectedAsset?.code !== "XLM") {
        setIsAddTrustLineModalVisible(!stellar.hasTrust(balances, selectedAsset?.code, selectedAsset?.issuer));
      } else {
        setIsAddTrustLineModalVisible(false);
      }
    }
  }, [selectedAsset, selectedAnchor, balances, isModalVisible]);
  return (
    <Modal centered show={isModalVisible} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Container className="d-flex align-items-center g-0">
            <div
              className={classnames("d-flex position-relative asset-icon me-2", {
                "d-none": toLower(selectedAnchor?.name) !== "stellar" && !selectedAnchor?.isPartner,
              })}
            >
              <Image alt={selectedAnchor?.name} src={selectedAnchor?.icon} layout="fill" />
            </div>
            <T>general.deposit</T>
          </Container>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoadingWrapper className="mx-auto" isLoading={isFetchingBalances}>
          <Row>
            {isSep6DepositLoading ? (
              <Spinner animation="border" role="status" size="lg" className="mx-auto my-3 color-primary" />
            ) : (
              <>
                <LabelValue
                  borderBottom
                  label={`${T("transactions.anchor")}:`}
                  value={isAnchorStellar ? "Native" : homeDomain}
                />
                <LabelValue
                  borderBottom
                  label={`${T("general.deposit_address")}:`}
                  value={how}
                  valueIcon={faCopy}
                  valueIconTitle={T("general.copy")}
                  onIconClick={() => {
                    setIsSuccess(true);
                    setToasterText(() => T("messages.copied"));
                    navigator.clipboard.writeText(how);
                  }}
                  valuePostFix={
                    <LinkWithIconCard
                      className={classnames("ms-1 text-dark", {
                        "text-white": isDarkTheme,
                      })}
                      icon={faQrcode}
                      title="QR Code"
                      onClick={() => CreatePopup(`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${how}`)}
                    />
                  }
                />
                <LabelValue
                  borderBottom
                  label={`${T("transactions.estimated_time")}:`}
                  value={eta ? `${round(eta / 60, 3)}m` : T("sep6DepositModal.not_available")}
                />
                <LabelValue
                  borderBottom
                  label={`${T("transactions.minimum")} ${T("transactions.amount")}:`}
                  value={
                    isAnchorStellar
                      ? ""
                      : min_amount
                      ? `${min_amount} ${assetCode}`
                      : T("sep6DepositModal.not_available")
                  }
                />
                <LabelValue
                  borderBottom
                  label={`${T("transactions.fee")}:`}
                  value={`${fee_fixed} ${fee_percent ? `+ ${fee_percent}%` : ""}`}
                />
              </>
            )}
            <ContactSupportText
              email={orgSupportEmail}
              className={classnames("mt-2", {
                "d-none": isAnchorStellar || isSep6DepositLoading,
              })}
            />
          </Row>
          <AddTrustLineModal
            onHide={onHide}
            isModalVisible={isAddTrustLineModalVisible}
            asset={selectedAsset}
            onTrustAdded={() => setIsAddTrustLineModalVisible(false)}
          />
        </LoadingWrapper>
      </Modal.Body>
    </Modal>
  );
};

export default Sep6DepositModal;
