import { get, map } from "lodash";
import Image from "next/image";
import { useContext } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { LanguageContext } from "../../../contexts/LanguageProvider";
import BusinessManImage from "/public/img/business_young_man_smiling-1920w.webp";
import classnames from "classnames";
import { GlobalStateContext } from "../../../contexts";

const FaqsSection = () => {
  const { isDarkTheme } = useContext(GlobalStateContext);
  const { strings } = useContext(LanguageContext);
  return (
    <Container
      fluid
      className={classnames({
        "bg-light": !isDarkTheme,
        "bg-black bg-opacity-50": isDarkTheme,
      })}
    >
      <Container className="px-md-5">
        <Row className="mt-5 ">
          <Col
            xs="12"
            md="7"
            className="py-4 d-flex flex-column justify-content-center"
          >
            <h4 className="text-center mb-3 color-primary">Faqs</h4>
            <Accordion>
              {map(get(strings, "faqs"), ({ question, answer }, key) => (
                <Accordion.Item eventKey={key}>
                  <Accordion.Header>{question}</Accordion.Header>
                  <Accordion.Body>
                    <div dangerouslySetInnerHTML={{ __html: answer }}></div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>

          <Col xs="12" md="5" className="d-none d-md-block">
            <Image
              src={BusinessManImage}
              layout="responsive"
              alt="clpx-logo"
              objectFit="contain"
              quality={100}
              height="450"
              width="500"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default FaqsSection;
