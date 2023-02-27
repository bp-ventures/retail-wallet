import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { get, toNumber } from "lodash";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { getAssetDetails } from "../../../../helpers";
import * as stellar from "../../../../stellar.ts";

const RenderSwapRate = ({ fromAsset, toAsset, setRate: setRateProp }) => {
  const [isInverted, setIsInverted] = useState(false);
  const [rate, setRate] = useState(0);
  const [inverseRate, setInverseRate] = useState(0);
  const [fromAssetCode, setFromAssetCode] = useState(get(fromAsset, "code"));
  const [toAssetCode, setToAssetCode] = useState(get(toAsset, "code"));
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchRate() {
      if (toAsset) {
        setIsLoading(true);
        setToAssetCode(get(toAsset, "code"));
        setFromAssetCode(get(fromAsset, "code"));
        const { minAmount: rate } = await stellar.calculateSendEstimatedAndPath(
          1,
          getAssetDetails(fromAsset),
          getAssetDetails(toAsset)
        );
        if (rate) {
          setRate(rate);
          setRateProp && setRateProp(toNumber(rate));
        }
        const {
          minAmount: inverseRate,
        } = await stellar.calculateSendEstimatedAndPath(
          1,
          getAssetDetails(toAsset),
          getAssetDetails(fromAsset)
        );
        if (inverseRate) {
          setInverseRate(inverseRate);
        }

        setIsLoading(false);
      }
    }
    fetchRate();
  }, [toAsset, fromAsset]);
  return (
    <div
      className={classnames("m-0 text-muted d-flex align-items-center", {
        "d-none": !toAsset,
      })}
    >
      <small>
        {isLoading ? (
          <Spinner
            animation="border"
            role="status"
            size="sm"
            className="mx-auto  text-muted"
          />
        ) : (
          <>
            {`1 ${isInverted ? toAssetCode : fromAssetCode}`}{" "}
            <span className="position-relative bottom-point-5">≈</span>{" "}
            {isInverted ? inverseRate : rate}
            <span className="ms-1">
              {isInverted ? fromAssetCode : toAssetCode}
            </span>
            <FontAwesomeIcon
              onClick={() => setIsInverted(!isInverted)}
              icon={faExchangeAlt}
              className="icon-sm text-muted ms-2 cursor-pointer"
            />
          </>
        )}
      </small>
    </div>
  );
};
export default RenderSwapRate;
