import { find, get, round, toLower, toNumber, toString } from "lodash";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Container, Modal, Row } from "react-bootstrap";
import { ToasterContext } from "../../../contexts";
import useFetchBalance from "../../../hooks/useFetchBalance";
import { T } from "../../translation";
import Sep6WithdrawForm from "./Form";
import { getAssetInfo } from "./helpers";
import Sep6WithdrawResult from "./Result";
import classnames from "classnames";

const Sep6WithdrawModal = ({
  isModalVisible,
  isSep6WithdrawLoading,
  toggleModal,
  handleTransactionsScreenAction,
  result,
  setResult,
  selectedAsset,
  setIsSep6WithdrawLoading,
  selectedAnchor,
}) => {
  const [assetInfo, setAssetInfo] = useState({});
  const [amount, setAmount] = useState(0);
  const [destAddress, setDestAddress] = useState("");
  const [isPaymentCall, setIsPaymentCall] = useState(false);
  const { setToasterText } = useContext(ToasterContext);
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
        setAvailableBalance(round(toNumber(balance) - toNumber(selling_liabilities), 7));
      } else {
        setAvailableBalance(0);
      }
    }
  }, [balanceObj]);

  useEffect(() => {
    const stellarAnchorInfo = get(find(selectedAsset?.anchors, { name: selectedAnchor?.name }), "stellarAnchorInfo");
    if (stellarAnchorInfo) {
      setAssetInfo(stellarAnchorInfo);
      setIsPaymentCall(true);
    } else {
      setIsPaymentCall(false);
    }
  }, [selectedAsset, selectedAnchor]);

  useEffect(() => {
    async function fetchAssetData() {
      if (selectedAsset) {
        try {
          setIsFetchingFee(true);
          const assetInfoResponse = await getAssetInfo({
            asset: selectedAsset,
          });
          setIsFetchingFee(false);

          if (assetInfoResponse) {
            setAssetInfo(get(assetInfoResponse, ["withdraw", selectedAsset.code], {}));
          }
        } catch (error) {
          setIsFetchingFee(false);
          setToasterText(toString(error));
        }
      }
    }

    if (selectedAsset && isModalVisible) {
      if (!isPaymentCall) {
        fetchAssetData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible, selectedAsset]);

  const resetAndToggleModal = () => {
    setAmount(0);
    setDestAddress();
    setResult();
    toggleModal();
  };

  return (
    <Modal centered show={isModalVisible} onHide={resetAndToggleModal}>
      <Modal.Header closeButton>
        <Container className="d-flex align-items-center g-0">
          <div
            className={classnames("d-flex position-relative asset-icon me-2", {
              "d-none": toLower(selectedAnchor?.name) !== "stellar",
            })}
          >
            <Image alt={selectedAnchor?.name} src={selectedAnchor?.icon} layout="fill" />
          </div>
          <T>general.withdraw</T>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {result ? (
            <Sep6WithdrawResult result={result} />
          ) : (
            <Sep6WithdrawForm
              selectedAnchor={selectedAnchor}
              isFetchingBalance={isFetchingBalance}
              isFetchingFee={isFetchingFee}
              availableBalance={availableBalance}
              assetInfo={assetInfo}
              assetCode={selectedAsset?.code}
              assetIssuer={selectedAsset?.issuer}
              isPaymentCall={isPaymentCall}
              amount={amount}
              destAddress={destAddress}
              resetAndToggleModal={resetAndToggleModal}
              setAmount={setAmount}
              setDestAddress={setDestAddress}
              isSep6WithdrawLoading={isSep6WithdrawLoading}
              setIsSep6WithdrawLoading={setIsSep6WithdrawLoading}
              handleTransactionsScreenAction={handleTransactionsScreenAction}
            />
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Sep6WithdrawModal;
