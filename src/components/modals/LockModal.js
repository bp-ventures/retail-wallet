import { get, replace } from "lodash";
import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { T } from "../../components/translation";
import {
  AuthContext,
  GlobalStateContext,
  ToasterContext,
} from "../../contexts";
import { sendAPayment } from "../../stellar/";
import styles from "../../styles/LockModal.module.css";
import { AssetCard } from "../cards";
import { LoadingButton } from "../buttons";

const ConfirmAction = ({
  T,
  isSubmitting,
  loadingText,
  lock_months,
  onConfirm,
  setIsConfirmActionVisible,
}) => (
  <Container>
    <Row className="mt-3 ">
      <Col xs="12">
        <h5>
          <T>lockModal.are_you_sure_you_want_to_lock</T>
        </h5>
      </Col>
      <Col xs="12" className="mt-2">
        <p>
          <T>
            lockModal.you_won_t_be_able_to_unlock_the_locked_asset_until_the_allotted_time
          </T>{" "}
          -
          <b>
            {lock_months} <T>general.months</T>
          </b>
        </p>
      </Col>
    </Row>
    <Row>
      <Col xs="12">
        <LoadingButton
          isLoading={isSubmitting}
          loadingText={loadingText}
          variant="primary"
          className="w-100 mt-3"
          onClick={onConfirm}
        >
          <T>lockModal.confirm_lock</T>
        </LoadingButton>
      </Col>
      <Col xs="12">
        <Button
          disabled={isSubmitting}
          variant="btn-outline-dark"
          onClick={() => setIsConfirmActionVisible(false)}
          className="w-100 mt-2"
        >
          <T>general.cancel</T>
        </Button>
      </Col>
    </Row>
  </Container>
);

const LockModal = ({ isLockModalVisible, toggleModal, data }) => {
  const asset = get(data, "asset", "");
  const lock_months = get(data, "lock_months", "");
  const unLocked_amount = get(data, "unLocked_amount", 0);

  const [amountToLock, setAmountToLock] = useState("");
  const { connectedWallet, pubKey } = useContext(AuthContext);
  const { setIsSigningWithLedger, isSigningWithLedger } = useContext(
    GlobalStateContext
  );
  const { setIsSuccess, setToasterText } = useContext(ToasterContext);
  const [isConfirmActionVisible, setIsConfirmActionVisible] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onHide = () => {
    setIsConfirmActionVisible(false);
    toggleModal();
  };

  const onLockClick = () => {
    if (amountToLock > 0) {
      if (amountToLock >= 1000) {
        setError("");
        setIsConfirmActionVisible(true);
      } else {
        setError("min amount (1000)");
      }
    } else {
      setError("Amount must be positive");
    }
  };

  return (
    <Modal centered show={isLockModalVisible} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <T>general.lock</T>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isConfirmActionVisible ? (
          <ConfirmAction
            lock_months={lock_months}
            isSubmitting={isSubmitting}
            loadingText={
              isSigningWithLedger && "messages.confirm_on_hardware_wallet"
            }
            T={T}
            onConfirm={() => {
              if (amountToLock > 0 && amountToLock >= 1000) {
                sendAPayment({
                  destinationId: process.env.NEXT_PUBLIC_LOCK_RECEIVING_WALLET,
                  amount: amountToLock,
                  connectedWallet,
                  asset,
                  pubKey,
                  setIsSubmitting,
                  onHide,
                  setIsSigningWithLedger,
                  setIsSuccess,
                  setToasterText,
                });
              }
            }}
            setIsConfirmActionVisible={setIsConfirmActionVisible}
            toggleModal={onHide}
          />
        ) : (
          <Container>
            <Row className="border-bottom pb-3">
              <Col xs="5">
                <AssetCard imageContainerClassName="me-1" value={asset} />
              </Col>
              <Col xs="7" className="text-end">
                <p className="mb-0 ">
                  <small>
                    <T>lockModal.available_amount</T>
                  </small>
                </p>
                <p className="mb-0 fw-bold">{unLocked_amount}</p>
              </Col>
            </Row>
            <Row className="mt-3 ">
              <Col xs="12">
                <h5>
                  <T>lockModal.how_much_do_you_want_to_lock</T>
                </h5>
              </Col>
              <Col xs="12" className="mt-2">
                <Form.Label className="text-muted">
                  <T>lockModal.enter_the_amount_you_want_to_lock</T>
                </Form.Label>
                <InputGroup className="mb-2">
                  <InputGroup.Text>$</InputGroup.Text>
                  <FormControl
                    onChange={(e) => setAmountToLock(e.target.value)}
                    type="number"
                    placeholder="0"
                  />
                </InputGroup>
                {error && <span className="text-danger">{error}</span>}
                <Button
                  onClick={() => onLockClick()}
                  variant="primary"
                  className="w-100 mt-3"
                  disabled={unLocked_amount <= 0 || amountToLock < 1000}
                >
                  <T>general.lock</T>
                </Button>
              </Col>
            </Row>
            <Card className={`mt-3 ${styles["min-time-container"]}`}>
              <Row>
                <Col xs="6">
                  <p className="mb-0">
                    <T>lockModal.minimum_lock_time</T>
                  </p>
                </Col>
                <Col xs="6" className="text-end">
                  <p className="mb-0 fw-bold">
                    {replace(lock_months, "m", "")} <T>general.months</T>
                  </p>
                </Col>
              </Row>
            </Card>
          </Container>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LockModal;
