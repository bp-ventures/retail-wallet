import { round } from "lodash";
import React, { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { LoadingButton } from "../buttons";

const TradeProtectionWarningModal = ({
  isWarningModalVisible,
  marketPrice,
  stellarPrice,
  percentageDiff,
  onConfirm,
  onHide,
}) => {
  const [isWarningAccepted, setIsWarningAccepted] = useState(false);

  const onClickConfirm = () => {
    if (isWarningAccepted) {
      onConfirm();
      onHide();
    }
    {
      setIsWarningAccepted(true);
    }
  };

  const resetAndHide = () => {
    setIsWarningAccepted(false);
    onHide();
  };

  const RenderWarningText = ({ warning }) => (
    <p
      className="d-flex align-items-center"
      dangerouslySetInnerHTML={{ __html: warning }}
    ></p>
  );
  return (
    <Modal centered show={isWarningModalVisible} onHide={resetAndHide}>
      <Modal.Header closeButton>
        <Modal.Title>Warning!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs="12" className="my-2">
              {isWarningAccepted ? (
                <RenderWarningText warning="You will be loosing money. Please try a smaller trade or contact support." />
              ) : (
                <RenderWarningText
                  warning={`The price is ${round(
                    percentageDiff,
                    2
                  )}% off the coingecko market price.
                <br/>Stellar price: ${stellarPrice}
                <br/>Coingecko market price: ${marketPrice}
                `}
                />
              )}
            </Col>
            <Col xs="6" className="my-2">
              <LoadingButton
                variant="primary"
                className="w-100 mt-3"
                onClick={onClickConfirm}
              >
                Ok
              </LoadingButton>
            </Col>
            <Col xs="6" className="my-2">
              <LoadingButton
                variant="primary-outline"
                className="w-100 mt-3"
                onClick={resetAndHide}
              >
                Cancel
              </LoadingButton>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default TradeProtectionWarningModal;
