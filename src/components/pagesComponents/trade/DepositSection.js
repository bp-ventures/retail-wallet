import classnames from "classnames";
import { filter, find, get, map } from "lodash";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AssetsList } from "../../../consts";
import { AssetCard } from "../../cards";
import { T } from "../../translation";

const AllowedAssets = [
  { code: "CLPX", anchorName: "Clpx.finance - Chile" },
  { code: "BTCLN", anchorName: "kbtrading - Bitcoin Lightning" },
  { code: "USDT", anchorName: "apay.io - USDT - Ethereum" },
  { code: "USDC", anchorName: "Stably - USA" },
  { code: "BTC", anchorName: "apay.io - Bitcoin" },
  { code: "ETH", anchorName: "apay.io - Ethereum" },
];

const DepositSection = ({
  showDepositSection,
  handleTransactionsScreenAction,
  setSelectedAsset,
  setSelectedAnchor,
  selectedAsset,
}) => {
  useEffect(() => {
    if (selectedAsset) {
      handleTransactionsScreenAction("deposit");
    }
  }, [selectedAsset]);
  return (
    <p className={classnames({ "d-none": !showDepositSection })}>
      <h3>
        <T>trade.how_do_you_want_to_fund_your_account</T>
      </h3>
      Deposit your CLPX, BTCLN, USDT, USDC (Stably), Bitcoin, or Ethereum
      <Container className="mt-3">
        {map(
          filter(AssetsList, ({ code }) => find(AllowedAssets, { code })),
          (asset) => {
            return (
              <Row
                className="cursor-pointer modal-list-item rounded-3"
                onClick={() => {
                  setSelectedAsset(asset);
                  setSelectedAnchor(
                    find(asset?.anchors, {
                      name: get(
                        find(AllowedAssets, { code: asset?.code }),
                        "anchorName"
                      ),
                    })
                  );
                }}
              >
                <Col xs=" d-flex align-items-center justify-content-between py-2">
                  <AssetCard value={asset} imageContainerClassName="me-2" />
                </Col>
              </Row>
            );
          }
        )}
      </Container>
    </p>
  );
};

export default DepositSection;
