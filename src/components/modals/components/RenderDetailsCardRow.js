import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import classnames from "classnames";

const RenderDetailsCardRow = ({
  label,
  borderTop,
  valueClassName,
  longValue,
  value,
  toolTipText,
  isLoading,
  children,
}) => (
  <Row
    className={classnames("my-1 ", {
      "py-1 border-top border-1": borderTop,
    })}
  >
    <Col xs={longValue ? 3 : 6} className="d-flex align-items-center ">
      <p className="mb-0">
        {label}
        <OverlayTrigger
          placement="top"
          delay={{ show: 200, hide: 300 }}
          overlay={<Tooltip id="button-tooltip">{toolTipText}</Tooltip>}
        >
          <span>
            <FontAwesomeIcon
              className="ms-2 icon-sm color-primary "
              icon={faInfoCircle}
            />
          </span>
        </OverlayTrigger>
      </p>
    </Col>
    <Col
      xs={longValue ? 9 : 6}
      className="text-end text-small fw-bold d-flex justify-content-end align-items-center"
    >
      {isLoading ? (
        <Spinner animation="border" size="sm" />
      ) : children ? (
        children
      ) : (
        <p
          className={classnames("mb-0", valueClassName)}
          dangerouslySetInnerHTML={{ __html: value }}
        ></p>
      )}
    </Col>
  </Row>
);

export default RenderDetailsCardRow;
