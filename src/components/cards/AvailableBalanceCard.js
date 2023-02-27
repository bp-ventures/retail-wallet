import { Spinner } from "react-bootstrap";
import { T } from "../translation";
import classnames from "classnames";
import * as stellar from "../../stellar";
import { round } from "lodash";
const AvailableBalanceCard = ({
  balance,
  subentry,
  className,
  onSelect = () => {},
  assetCode,
  isLoading,
}) => {
  return (
    <small className={classnames("d-flex align-items-baseline", className)}>
      <a
        className="cursor-pointer text-decoration-none text-muted"
        onClick={() => onSelect(balance)}
      >
        <T>general.balance</T>:
        <span className="color-primary fw-bold ms-1">
          {isLoading ? (
            <Spinner
              animation="border"
              size="sm"
              className="color-primary ms-1 mt-2"
            />
          ) : (
            balance
          )}
        </span>
        &nbsp;{assetCode}
      </a>
      {assetCode === "XLM" && (
        <p className="text-muted ms-2 d-flex align-items-baseline">
          |&nbsp;<T>Reserved</T>:
          <span className="color-primary fw-bold ms-1">
            {isLoading ? (
              <Spinner
                animation="border"
                size="sm"
                className="color-primary ms-1 mt-2"
              />
            ) : (
              round(stellar.calculateReservedXLM(subentry))
            )}
          </span>
        </p>
      )}
    </small>
  );
};

export default AvailableBalanceCard;
