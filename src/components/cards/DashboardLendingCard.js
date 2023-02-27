import { isEmpty, toString } from "lodash";
import React, { useContext } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { AssetCard, LinkWithIconCard } from ".";
import { AuthContext } from "../../contexts";
import { makeStallerExpertMarketURL, openLinkInNewTab } from "../../utils";
import { T } from "../translation";

const RenderCardItem = ({ label, value }) => {
  return (
    <div>
      <p className="mb-0 fw-bold color-primary">
        {value === "0" ? value : isEmpty(value) ? "-" : value}
      </p>
      <p className="mb-0 ">
        <small>{label}</small>
      </p>
    </div>
  );
};

const DashboardLendingCard = ({
  data,
  setSelectedRow,
  setIsLockModalVisible,
  setIsConnectModalVisible,
  setIsSwapModalVisible,
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const {
    asset,
    rate,
    lock_months,
    locked_amount,
    value_in_usdc,
    unLocked_amount,
    market_size,
    lockable,
  } = data;
  return (
    <Card className="mt-3 shadow-sm rounded-3">
      <Card.Body>
        <Row className="mt-1 mb-3">
          <Col className="d-flex justify-content-between">
            <AssetCard
              showAssetDescription
              value={asset}
              valueClassName="fw-bold color-primary me-1"
              imageContainerClassName="me-2"
            />
            <Row className="g-1 d-flex g-0 justify-content-end  ">
              <Col className="d-flex justify-content-end">
                <Button
                  variant="outline-primary"
                  className="action-btn"
                  onClick={() => {
                    setSelectedRow(data);
                    isLoggedIn
                      ? setIsLockModalVisible(true)
                      : setIsConnectModalVisible(true);
                  }}
                  disabled={!lockable}
                >
                  <T>general.lock</T>
                </Button>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button
                  variant="outline-primary"
                  className="action-btn"
                  onClick={() => {
                    setSelectedRow(data);
                    isLoggedIn
                      ? setIsSwapModalVisible(true)
                      : setIsConnectModalVisible(true);
                  }}
                >
                  <T>general.swap</T>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.market_size")}
              value={
                <LinkWithIconCard
                  onClick={() =>
                    openLinkInNewTab(makeStallerExpertMarketURL(asset))
                  }
                >
                  {market_size}
                </LinkWithIconCard>
              }
            />
          </Col>
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.interest_rate")}
              value={toString(rate)}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.min_time")}
              value={toString(lock_months)}
            />
          </Col>
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.locked_amount")}
              value={toString(locked_amount)}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.value_in_usdc")}
              value={toString(value_in_usdc)}
            />
          </Col>
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.unlocked_amount")}
              value={toString(unLocked_amount)}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashboardLendingCard;
