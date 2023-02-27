import { Card, Col, Row } from "react-bootstrap";

const PartnersSection = () => {
  return (
    <Row className=" text-center">
      <Col xs="12">
        <Card.Title className="color-primary ">Partnerships:</Card.Title>
        <p>
          or email&nbsp;
          <a alt="Support Email" href="mailto:info@clpx.finance">
            info@clpx.finance
          </a>
          &nbsp;to ask for partnerships.
        </p>
      </Col>
    </Row>
  );
};

export default PartnersSection;
