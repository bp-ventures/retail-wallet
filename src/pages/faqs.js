import { get, map } from "lodash";
import React, { useContext } from "react";
import { Accordion, Container } from "react-bootstrap";
import { LanguageContext } from "../contexts/LanguageProvider";
import { T } from "../components/translation";
import { SiteConfigs } from "../consts";
const Faqs = () => {
  const { strings } = useContext(LanguageContext);

  return (
    <Container className="px-md-5">
      <div className="mt-4">
        <h4 className="text-center mb-3 color-primary">
          <T>general.faqs</T>
        </h4>
        <Accordion defaultActiveKey="0">
          {map(get(strings, "faqs"), ({ question, answer }, key) => (
            <Accordion.Item eventKey={key}>
              <Accordion.Header>{question}</Accordion.Header>
              <Accordion.Body>
                <div dangerouslySetInnerHTML={{ __html: answer }}></div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </Container>
  );
};

export const getServerSideProps = ({}) => {
  return {
    props: {
      title: `${get(SiteConfigs, "siteName")} - Faqs`,
    },
  };
};

export default Faqs;
