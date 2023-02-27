import classnames from "classnames";
import { get } from "lodash";
import { Col, Container, Row } from "react-bootstrap";
import { SiteConfigs } from "../consts";

const InfoCard = ({ title, underlined, children }) => (
  <>
    <h6
      className={classnames("mb-0", {
        "text-decoration-underline": underlined,
      })}
    >
      {title}
    </h6>
    {children}
  </>
);

const Audit = () => {
  return (
    <>
      <Container className="pb-5 pt-5">
        <h3 className="color-primary text-center">FUNDS UNDER MANAGEMENT</h3>
        <Row className="d-flex justify-content-center">
          <Col xs="12" md="6">
            <InfoCard title="Audit">
              <p>Last updated on August 1, 2022</p>
            </InfoCard>

            <InfoCard title="CLPX" underlined>
              <p className="text-break">
                Pegged to CLP Chilean peso.
                <br />
                <br />
                <a
                  target="_blank"
                  alt="Stellar expert"
                  rel="noreferrer"
                  href="https://stellar.expert/explorer/public/asset/CLPX-GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G-1"
                >
                  https://stellar.expert/explorer/public/asset/CLPX-GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G-1
                </a>
                <br />
                <br />
                ISSUED: 3,912,337 CLPX roughly 4,802 USD in CLPX
                <br />
                <br />
                Backed by 5000 USDC
              </p>
            </InfoCard>
            <InfoCard title="">
              <p className="mt-4 text-break">
                <a
                  alt="stellar developer documentation"
                  target="_blank"
                  rel="noreferrer"
                  href="https://stellar.expert/explorer/public/account/GBGZYDBTXYZDKZOONV5KEHTWQUGFRYUMXJR3PA5DLHFKSILI6DH7YMGP"
                >
                  https://stellar.expert/explorer/public/account/GBGZYDBTXYZDKZOONV5KEHTWQUGFRYUMXJR3PA5DLHFKSILI6DH7YMGP
                </a>
              </p>
            </InfoCard>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = ({}) => {
  return {
    props: {
      title: `${get(SiteConfigs, "siteName")} - Audit`,
    },
  };
};

export default Audit;
