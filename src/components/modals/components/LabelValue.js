import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Spinner } from "react-bootstrap";
const LabelValue = ({
  isLoading,
  label,
  noVerticalMargin,
  borderBottom,
  value,
  valuePostFix,
  extraInfo,
  valueIcon,
  onIconClick,
  valueIconTitle,
}) => (
  <>
    <Col
      xs={`4 ${noVerticalMargin ? "" : "py-2"}`}
      className={borderBottom && "border-bottom"}
    >
      <p className="mb-2">{label}</p>
    </Col>
    <Col
      xs={`8 ${noVerticalMargin ? "" : "py-2"}`}
      className={borderBottom && "border-bottom"}
    >
      {isLoading ? (
        <Spinner animation="border" size="sm" className="color-primary" />
      ) : (
        <>
          <p className="text-break mb-2">
            {value}
            {valueIcon && (
              <FontAwesomeIcon
                onClick={onIconClick}
                className="icon-sm ms-2 cursor-pointer"
                icon={valueIcon}
                title={valueIconTitle}
              />
            )}
            {valuePostFix}
          </p>
          {extraInfo && <small className="text-small mb-1">{extraInfo}</small>}
        </>
      )}
    </Col>
  </>
);

export default LabelValue;
