import { Card, Col, Row } from "react-bootstrap";

const ContactUsSection = () => {
  return (
    <Row className="pt-3 text-center">
      <Col xs="12">
        <Card.Title className="color-primary ">Contact Us!</Card.Title>
        <a alt="Support Email" href="mailto:info@clpx.finance">
          info@clpx.finance
        </a>
        <Card.Title className="color-primary mt-4 ">API</Card.Title>
        We follow the stellar standards available: <br />
        <a
          alt="Stellar developer documentation"
          href="https://developers.stellar.org/docs/building-apps/connect-to-anchors/"
        >
          https://developers.stellar.org/docs/building-apps/connect-to-anchors/
        </a>
      </Col>
    </Row>
  );
};

export default ContactUsSection;
