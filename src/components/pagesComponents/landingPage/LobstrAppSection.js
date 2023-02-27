import Image from "next/image";
import { Card, Col, Row } from "react-bootstrap";
import CLPX_APP_SS from "/public/img/CLPX-Screens1-1920w.webp";
import APPLE_STORE_LOGO from "/public/img/appstore-1920w.png";
import GOOGLE_PLAY_LOGO from "/public/img/googlplay-1920w.webp";
import { openLinkInNewTab } from "../../../utils";

const LobstrAppSection = () => {
  return (
    <Row className="py-5">
      <Col xs="12" md="6">
        <Image
          src={CLPX_APP_SS}
          layout="responsive"
          alt="LobstrApp"
          objectFit="cover"
          quality={100}
        />
      </Col>
      <Col
        xs="12"
        md="6"
        className="mt-3 mt-md-0 d-flex justify-content-center flex-column "
      >
        <Card.Title className="color-primary">With Lobstr Wallet:</Card.Title>
        <ul>
          <li>Download the Lobstr wallet for Android/IOS</li>
          <li>Register and login to your account</li>
          <li>
            Create a Trustline for CLPX by navigating to assets, add a custom
            token & enter the domain name as kbtrading.org and add CLPX
          </li>
          <li>To Pay from CLPX to a bank account select withdrawal</li>
          <li>To Receive with CLPX from a bank select deposit</li>
        </ul>
        <Row>
          <Col className="d-flex justify-content-center justify-content-md-start">
            <Image
              src={APPLE_STORE_LOGO}
              onClick={() =>
                openLinkInNewTab(
                  "https://apps.apple.com/us/app/lobstr-stellar-wallet/id1404357892"
                )
              }
              layout="fixed"
              width="150"
              height="100"
              alt="Apple store"
              objectFit="contain"
              quality={100}
              className="pe-2 cursor-pointer"
            />
            <Image
              src={GOOGLE_PLAY_LOGO}
              onClick={() =>
                openLinkInNewTab(
                  "https://play.google.com/store/apps/details?id=com.lobstr.client"
                )
              }
              className="pe-2 cursor-pointer"
              layout="fixed"
              width="150"
              height="100"
              alt="Google play"
              objectFit="contain"
              quality={100}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LobstrAppSection;
