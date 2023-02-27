import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Button, Row } from "react-bootstrap";
import { HeroWrapper } from "../../styledComponents/pages/landingPage";
import { T } from "../../translation";
import { openLinkInNewTab } from "../../../utils";
import CLPX_ICON from "/public/img/logo.png";
import HeroBgImg from "/public/img/people_work_meeting-2880w.webp";
import { useContext } from "react";
import { ToasterContext } from "../../../contexts";

const HeroSection = () => {
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);

  return (
    <HeroWrapper>
      <Image
        src={HeroBgImg}
        layout="fill"
        alt="clpx-background"
        objectFit="cover"
        quality={100}
        className="z-index-minus-1 bg-black bg-opacity-50 bg-overlay"
      />
      <Row className="text-center z-index-1 d-flex justify-content-center text-center z-index-1">
        <h2>1 CLPX = 1 Chilean Peso on Stellar</h2>
        <Image
          src={CLPX_ICON}
          layout="fixed"
          alt="clpx-logo"
          objectFit="cover"
          quality={100}
          height="100"
          width="100"
        />
        <a
          className="cursor-pointer text-white"
          onClick={() => {
            openLinkInNewTab(
              "https://stellar.expert/explorer/public/asset/CLPX-GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G-1"
            );
          }}
        >
          View on Stellar.expert
        </a>
        <Button
          className=" border-0 mt-3 w-auto"
          onClick={() => {
            setIsSuccess(true);
            setToasterText(() => T("messages.copied"));
            navigator.clipboard.writeText(
              "GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G"
            );
          }}
        >
          <span className="text-break">
            Issuing Key:
            GDYSPBVZHPQTYMGSYNOHRZQNLB3ZWFVQ2F7EP7YBOLRGD42XIC3QUX5G
          </span>
          <FontAwesomeIcon
            className="icon-sm ms-2"
            icon={faCopy}
            title={T("general.copy")}
          />
        </Button>
      </Row>
    </HeroWrapper>
  );
};

export default HeroSection;
