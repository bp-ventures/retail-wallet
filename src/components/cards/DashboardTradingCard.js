import { isEmpty, toString } from "lodash";
import React, { useContext } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { AssetCard, LinkWithIconCard } from ".";
import { AuthContext } from "../../contexts";
import { makeStallerExpertMarketURL, openLinkInNewTab } from "../../utils";
import { T } from "../translation";
import ValueWithUpDownArrows from "../ValueWithUpDownArrows";

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

const DashboardTradingCard = ({
  data,
  setSelectedRow,
  setIsConnectModalVisible,
  setIsSwapModalVisible,
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const {
    asset,
    market_size,
    price_USD,
    change24h_USD,
    volume24h_USD,
    coinGeckoPricePercentageChange1h,
    coingecko_price,
    unLocked_amount,
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
              label={T("homePage.market_cap")}
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
              label={T("homePage.last_price")}
              value={toString(price_USD)}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="6">
            <RenderCardItem
              label="24hr"
              value={
                <ValueWithUpDownArrows
                  value={change24h_USD}
                  emptyPlaceHolder="-"
                />
              }
            />
          </Col>
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.twenty_four_hr_volume")}
              value={toString(volume24h_USD)}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="6">
            <RenderCardItem
              label="1hr"
              value={
                <ValueWithUpDownArrows
                  value={coinGeckoPricePercentageChange1h}
                  emptyPlaceHolder="-"
                />
              }
            />
          </Col>
          <Col xs="6">
            <RenderCardItem
              label={T("homePage.coingecko_price")}
              value={toString(coingecko_price)}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="6">
            <RenderCardItem
              label={T("general.balance")}
              value={toString(unLocked_amount)}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashboardTradingCard;
