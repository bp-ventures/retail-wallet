import Image from "next/image";
import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { T } from "../../components/translation";
import { GlobalStateContext } from "../../contexts";
import { LanguageContext } from "../../contexts/LanguageProvider";
import EN_FLAG from "/public/img/en.png";
import ES_FLAG from "/public/img/es.png";
import PT_FLAG from "/public/img/pt.png";

const getSelectedLocaleFlagIcon = (language) => {
  switch (language) {
    case "es":
      return ES_FLAG;
    case "pt-brl":
      return PT_FLAG;
    default:
      return EN_FLAG;
  }
};

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
  const { language } = useContext(LanguageContext);

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="btn btn-outline pointer-event p-0"
    >
      <div className="d-flex align-items-center">
        <strong>
          <p className="text-muted me-2 mb-0">
            <T>general.language</T>
          </p>
        </strong>
        <Image
          alt="Selected language"
          src={getSelectedLocaleFlagIcon(language)}
          layout="fixed"
          width={30}
          height={30}
        />
      </div>
    </div>
  );
});

CustomToggle.displayName = "CustomToggle";

const LanguageSelector = () => {
  const { updateLanguage } = useContext(LanguageContext);
  const { getBootStrapComponentVariant } = useContext(GlobalStateContext);

  return (
    <Dropdown className="mx-0 me-md-3">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
      <Dropdown.Menu variant={getBootStrapComponentVariant()}>
        <Dropdown.Item
          eventKey="5"
          className="d-flex"
          onClick={() => updateLanguage("en")}
        >
          <Image
            alt="English"
            src={EN_FLAG}
            layout="fixed"
            width={25}
            height={25}
          />{" "}
          <span className="ms-2">English</span>
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="6"
          className="d-flex"
          onClick={() => updateLanguage("es")}
        >
          <Image
            alt="Spanish"
            src={ES_FLAG}
            layout="fixed"
            width={25}
            height={25}
          />{" "}
          <div className="ms-2">Spanish</div>
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="7"
          className="d-flex"
          onClick={() => updateLanguage("pt-brl")}
        >
          <Image
            alt="Portuguese"
            src={PT_FLAG}
            layout="fixed"
            width={25}
            height={25}
          />{" "}
          <div className="ms-2">Portuguese </div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
LanguageSelector.displayName = "LanguageSelector";

export default LanguageSelector;
