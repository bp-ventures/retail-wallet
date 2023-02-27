import {
  faCoins,
  faLaptop,
  faRocket,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Container, Row } from "react-bootstrap";

const InfoCard = ({ title, description, icon }) => (
  <Card className="text-center p-3 shadow-sm h-100">
    <FontAwesomeIcon
      className="mx-auto color-primary mt-3"
      size="2x"
      icon={icon}
    />
    <Card.Title className="mt-3 color-primary">{title}</Card.Title>
    <Card.Body>
      <p>{description}</p>
    </Card.Body>
  </Card>
);

const FourFeatureCards = () => {
  return (
    <Row>
      <Col xs="12" md="3" className="mb-3 mb-md-0">
        <InfoCard
          title="SIMPLE"
          description="Easy to use cash in, cash out and trading. Access from your computer or mobile phone."
          icon={faLaptop}
        />
      </Col>
      <Col xs="12" md="3" className="mb-3 mb-md-0">
        <InfoCard
          title="FAST"
          description="Send your funds anywhere in the world in seconds."
          icon={faRocket}
        />
      </Col>
      <Col xs="12" md="3" className="mb-3 mb-md-0">
        <InfoCard
          title="SAFE"
          description="We use industry-leading technology that protects your funds and guarantees it is available when you need it. Audited by top Law Firm"
          icon={faShieldAlt}
        />
      </Col>
      <Col xs="12" md="3" className="mb-3 mb-md-0">
        <InfoCard
          title="LOW-COST"
          description="Send your funds anywhere in the world for less than 1 penny. See our low feeds and excellent exchange rates up front with no hidden costs."
          icon={faCoins}
        />
      </Col>
    </Row>
  );
};

export default FourFeatureCards;
