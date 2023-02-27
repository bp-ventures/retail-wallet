import Image from "next/image";
import { Col } from "react-bootstrap";
import paxfulImg from "/public/img/paxfulLogo.webp";

const CentralizedExchangesSection = () => {
  return (
    <Col xs="12" md="6" className="mt-3 mt-md-0">
      <h4 className="color-primary">Centralized Exchanges?</h4>
      <Image
        alt="Paxful"
        src={paxfulImg}
        layout="responsive"
        objectFit="contain"
        quality={100}
        className="mt-3"
      />
    </Col>
  );
};

export default CentralizedExchangesSection;
