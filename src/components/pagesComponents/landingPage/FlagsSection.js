import Image from "next/image";
import { useContext } from "react";
import { Row } from "react-bootstrap";
import { GlobalStateContext } from "../../../contexts";
import ChileFlagImg from "/public/img/chile_flag-1920w.webp";
import flagsImg from "/public/img/flags.webp";
import classnames from "classnames";

const FlagsSection = () => {
  const { isDarkTheme } = useContext(GlobalStateContext);
  return (
    <Row
      className={classnames(
        " d-flex justify-content-center flex-column align-items-center rounded-pill",
        {
          "bg-gradient bg-black": isDarkTheme,
          "bg-white": !isDarkTheme,
        }
      )}
    >
      <Image
        alt="ChileFlagImg"
        src={ChileFlagImg}
        layout="fixed"
        objectFit="contain"
        quality={100}
        height="100"
        width="100"
        className="mt-1"
      />
      <Image
        alt="flags"
        src={flagsImg}
        layout="fixed"
        objectFit="contain"
        quality={100}
        height="100"
        width="800"
      />
    </Row>
  );
};

export default FlagsSection;
