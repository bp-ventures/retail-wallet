import classnames from "classnames";
import { isNumber, round, toLower, toNumber, toString } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Col, Form, FormLabel, InputGroup, Row } from "react-bootstrap";
import { StrKey } from "stellar-sdk";
import {
  AuthContext,
  GlobalStateContext,
  ToasterContext,
} from "../../../contexts";
import { sendAPayment } from "../../../stellar/index";
import { LoadingButton } from "../../buttons";
import { AvailableBalanceCard } from "../../cards/";
import { T } from "../../translation";
import { LabelValue } from "../components";

const ContactSupportText = ({ anchorName, email }) => (
  <p className="mb-0">
    <small>
      <T>transactions.support_for_withdraw_to</T> {anchorName}: &nbsp;
      <a alt="support email" href={`mailto:${email}`}>
        {email}
      </a>
    </small>
  </p>
);

const Sep6PartnersWithdrawForm = ({
  isFetchingFee,
  isFetchingBalance,
  availableBalance,
  isPaymentCall,
  assetCode,
  assetIssuer,
  isSep6WithdrawLoading,
  amount,
  destAddress,
  setAmount,
  setDestAddress,
  assetInfo: { min_amount = 0, fee_fixed = 0.0001, fee_percent = 0 },
  setIsSep6WithdrawLoading,
  resetAndToggleModal,
  selectedAnchor,
}) => {
  const { connectedWallet, pubKey } = useContext(AuthContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const { setIsSigningWithLedger } = useContext(GlobalStateContext);
  const [memo, setMemo] = useState("");
  const [totalFee, setTotalFee] = useState(0);
  const [receive, setReceive] = useState(0);
  const [lastChanged, setLastChanged] = useState("amount");
  const [isAnchorStellar, setIsAnchorStellar] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setDestAddress(selectedAnchor?.pubkey);
  }, []);

  useEffect(() => {
    //calculating total fee
    const percentageAmount = (toNumber(fee_percent) / 100) * toNumber(amount);
    setTotalFee(toNumber(fee_fixed) + toNumber(percentageAmount));
  }, [fee_fixed, fee_percent, amount, receive]);

  useEffect(() => {
    if (lastChanged === "amount") {
      if (amount > 0) {
        isAnchorStellar
          ? setReceive(toNumber(round(amount, 7)))
          : setReceive(round(toNumber(amount) - toNumber(totalFee), 7));
      } else {
        setReceive("");
      }
    }
  }, [amount, totalFee, lastChanged]);

  useEffect(() => {
    setError("");
  }, [assetCode]);

  const onSubmit = () => {
    if (!memo) {
      setError("Required!");
      return;
    }
    if (StrKey.isValidEd25519PublicKey(destAddress)) {
      setError("");
      //do send payment
      if (amount > 0) {
        sendAPayment({
          destinationId: destAddress,
          amount: toString(amount),
          connectedWallet,
          asset: {
            code: assetCode,
            issuer: assetCode === "XLM" ? "native" : assetIssuer,
          },
          pubKey,
          setIsSubmitting: setIsSep6WithdrawLoading,
          onHide: resetAndToggleModal,
          setToasterText,
          memo,
          setIsSigningWithLedger,
          setIsSuccess,
        });
      }
    } else {
      setError(() => T("messages.invalid_address_format"));
    }
  };

  return (
    <>
      <Col xs="12">
        <FormLabel>
          <T>transactions.amount</T> *
        </FormLabel>
        <InputGroup>
          <Form.Control
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={({ target: { value } }) => {
              setLastChanged("amount");
              setAmount(value ? round(value, 7) : value);
            }}
          />
          <InputGroup.Text className="px-4">{assetCode}</InputGroup.Text>
        </InputGroup>
        <AvailableBalanceCard
          isLoading={isFetchingBalance}
          balance={round(availableBalance, 7)}
          onSelect={setAmount}
        />
      </Col>
      <Col xs="12" className="mt-2">
        <FormLabel>
          <T>transactions.destination</T> *
        </FormLabel>
        <InputGroup>
          <Form.Control
            type="text"
            required
            value={destAddress}
            onChange={(e) => setDestAddress(e.target.value)}
          />
        </InputGroup>
        <small>{`${assetCode} ${toLower(
          T("transactions.destination")
        )}  ${toLower(T("transactions.address"))}`}</small>
      </Col>
      <Row>
        <Col xs="12" className="mt-2">
          <FormLabel>
            <T>transactions.member_id</T> / <T>transactions.memo</T> *
          </FormLabel>
          <InputGroup>
            <Form.Control
              className={classnames({ "is-invalid": error })}
              type="text"
              required
              value={memo}
              onChange={(e) => {
                setError("");
                setMemo(e.target.value);
              }}
            />
          </InputGroup>
          {error && <p className="mb-0 text-danger">{error}</p>}
        </Col>
      </Row>
      <Row>
        <div className="my-2 mt-3 border-bottom" />
        <LabelValue
          isLoading={isFetchingFee}
          noVerticalMargin
          label={`${T("transactions.fee")}:`}
          value={`${fee_fixed} + ${fee_percent}%`}
        />
        <LabelValue
          isLoading={isFetchingFee}
          noVerticalMargin
          label={`${T("transactions.total_fee")}:`}
          value={
            isNumber(totalFee)
              ? `${round(totalFee, 8)} ${isPaymentCall ? "XLM" : assetCode}`
              : LoadingText
          }
        />
        <LabelValue
          isLoading={isFetchingFee}
          noVerticalMargin
          label="Receive:"
          value={
            <InputGroup>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                required
                value={receive}
                onChange={({ target: { value } }) => {
                  setLastChanged("receive");
                  if (value < 0 || !value) {
                    setReceive("");
                    setAmount("");
                  } else {
                    const inputValue = round(toNumber(value), 7);
                    setReceive(inputValue);
                    isAnchorStellar
                      ? setAmount(inputValue)
                      : setAmount(
                          round(
                            (inputValue + toNumber(fee_fixed)) /
                              (1 - toNumber(fee_percent) / 100),
                            7
                          )
                        );
                  }
                }}
              />
            </InputGroup>
          }
        />

        <div className="my-2 border-bottom" />
      </Row>
      <Col xs="8">
        <ContactSupportText
          anchorName={selectedAnchor?.name}
          email={selectedAnchor?.supportEmail}
        />
      </Col>
      <Col xs="4 ms-auto my-auto mt-2">
        <LoadingButton
          isLoading={isSep6WithdrawLoading}
          disabled={!amount || !destAddress || error}
          className="ms-auto d-flex "
          onClick={onSubmit}
        >
          <T>transactions.continue</T>
        </LoadingButton>
      </Col>
    </>
  );
};

export default Sep6PartnersWithdrawForm;
