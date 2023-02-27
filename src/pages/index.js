import Image from "next/image";
import { Container, Row } from "react-bootstrap";
import {
  CentralizedExchangesSection,
  ContactUsSection,
  FaqsSection,
  FeatureCards,
  FlagsSection,
  FourFeatureCards,
  HeroSection,
  LobstrAppSection,
  PartnersSection,
  WhereToTradeSection,
} from "../components/pagesComponents/landingPage/";
import CLPX_ICON from "/public/img/logo.png";
import classnames from "classnames";
import { useContext } from "react";
import { GlobalStateContext } from "../contexts";
const CLPXLandingPage = () => {
  const { isDarkTheme } = useContext(GlobalStateContext);

  return (
    <>
      <Container>
        <HeroSection />
        <FlagsSection />
        <FeatureCards />
      </Container>
      <FaqsSection />
      <Container className="px-5 my-5">
        <FourFeatureCards />
      </Container>
      <Container
        fluid
        className={classnames({
          "bg-light": !isDarkTheme,
          "bg-opacity-50 bg-black": isDarkTheme,
        })}
      >
        <Container className="px-md-5 py-5">
          <Row>
            <WhereToTradeSection />
            <CentralizedExchangesSection />
          </Row>
        </Container>
      </Container>
      <Container className="px-md-5 ">
        <LobstrAppSection />
      </Container>
      <Container
        fluid
        className={classnames({
          "bg-light": !isDarkTheme,
          "bg-opacity-50 bg-black": isDarkTheme,
        })}
      >
        <Container className="px-md-5 py-5">
          <PartnersSection />
          <ContactUsSection />
          <Row className="d-flex justify-content-center mt-4">
            <Image
              src={CLPX_ICON}
              layout="fixed"
              alt="clpx-logo"
              objectFit="cover"
              quality={100}
              height="80"
              width="80"
            />
          </Row>
        </Container>
      </Container>
    </>
  );
};

export const getServerSideProps = ({}) => {
  return {
    props: {
      title:
        "CLPX - Stellar Anchor for Chile & DeFI trading + investments for south Americans.",
      description:
        "CLPX allows people to cash in and out from stellar using the CLPX stable coin which can be converted 1 to 1 to a chilean peso. As well with the clpx DeFI dashboard south americans can gain interest or swap their tokens for USDC, Bitcoin, Bitcoin Lightning, or Ethereum.",
      hideAnnouncement: true,
    },
  };
};

export default CLPXLandingPage;
