import { Card, Col, Row } from "react-bootstrap";
import lobstrImg from "/public/img/lobstr.png";
import niceTradeImg from "/public/img/nice-trade.webp";
import scopulyImg from "/public/img/scopuly.webp";
import StellarImg from "/public/img/stellar-port-1920w.webp";
import stellarTermImg from "/public/img/stellarTerm.webp";
import Image from "next/image";
import stellarXImg from "/public/img/stellarX.png";
import { openLinkInNewTab } from "../../../utils";

const WhereToTrade = ({ title, description, image, link }) => (
  <Card
    className="align-items-center text-center d-flex cursor-pointer h-100"
    onClick={() => openLinkInNewTab(link)}
  >
    <Image
      alt="Icon"
      src={image}
      layout="fixed"
      objectFit="contain"
      quality={100}
      height="100"
      width="100"
      className="mx-auto"
    />
    <Card.Title className="px-3 mb-0">{title}</Card.Title>
    <p>{description}</p>
  </Card>
);

const WhereToTradeSection = () => {
  return (
    <Col xs="12" md="6">
      <h4 className="color-primary">Where to Trade?</h4>
      <p>Trade CLPX on these venues in addition to the clpx dashboard.</p>
      <Row>
        <Col md="6" xs="12">
          <WhereToTrade
            link="https://www.stellarx.com/"
            image={stellarXImg}
            title="Trade on stellarx.com"
          />
        </Col>
        <Col md="6" xs="12" className="mt-3 mt-md-0">
          <WhereToTrade
            link="https://lobstr.co/trade/native/CLPX:GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G"
            image={lobstrImg}
            title="Trade on lobstr.co against XLM"
          />
        </Col>
        <Col md="6" xs="12" className="mt-3">
          <WhereToTrade
            link="https://stellarterm.com/"
            image={stellarTermImg}
            title="Trade on stellarterm.com against XLM"
          />
        </Col>
        <Col md="6" xs="12" className="mt-3">
          <WhereToTrade
            link="https://stellarport.io/exchange/native/XLM/GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G/CLPX"
            image={StellarImg}
            title="Trade on stellarport.io against XLM"
          />
        </Col>

        <Col md="6" xs="12" className="mt-3">
          <WhereToTrade
            link="https://scopuly.com/"
            image={scopulyImg}
            title="Trade on scopuly.com against XLM"
          />
        </Col>
        <Col md="6" xs="12" className="mt-3">
          <WhereToTrade
            link="https://nicetrade.co/"
            image={niceTradeImg}
            title="Trade on nicetrade.co against XLM"
          />
        </Col>
      </Row>
    </Col>
  );
};

export default WhereToTradeSection;
