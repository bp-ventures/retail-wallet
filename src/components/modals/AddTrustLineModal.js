import React, { useContext, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { LoadingButton } from "../buttons";
import { T } from "../translation";
import * as stellar from "../../stellar";
import {
  AuthContext,
  GlobalStateContext,
  ToasterContext,
} from "../../contexts";
import { toString } from "lodash";

const AddTrustLineModal = ({ isModalVisible, asset, onTrustAdded, onHide }) => {
  const { pubKey, connectedWallet } = useContext(AuthContext);
  const { setIsSigningWithLedger } = useContext(GlobalStateContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const [isAddingTrust, setIsAddingTrust] = useState(false);
  const onClickConfirm = async () => {
    try {
      setIsAddingTrust(true);
      await stellar.addTrustLine({
        pubKey,
        asset,
        connectedWallet,
        setIsSigningWithLedger,
      });
      setIsAddingTrust(false);
      setIsSuccess(true);
      setToasterText("messages.trustline_added_successfully");
      onTrustAdded();
    } catch (error) {
      setIsAddingTrust(false);
      setToasterText(toString(error));
    }
  };

  return (
    <Modal centered show={isModalVisible} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Warning!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs="12" className="my-2">
              <p>
                <T>transactions.you_dont_currently_have_a_stellar</T>{" "}
                {asset?.code} <T>transactions.sub_account</T> -{" "}
                <T>transactions.would_you_like_to_create_trustline</T>
              </p>
            </Col>
            <Col xs="6" className="my-2">
              <LoadingButton
                isLoading={isAddingTrust}
                variant="primary"
                className="w-100 mt-3"
                onClick={() => onClickConfirm()}
              >
                Create trustline
              </LoadingButton>
            </Col>
            <Col xs="6" className="my-2">
              <LoadingButton
                variant="primary-outline"
                className="w-100 mt-3"
                onClick={onHide}
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

export default AddTrustLineModal;
