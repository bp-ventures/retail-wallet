import { useContext, useState, useEffect } from "react";
import {
  Accordion,
  Carousel,
  useAccordionButton,
  Button,
  Container,
  AccordionContext,
} from "react-bootstrap";
import Image from "next/image";
import { isEmpty, map } from "lodash";
import { AnnouncementsList } from "../consts/Announcements";
import { CreatePopup } from "../components";
import router from "next/router";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { GlobalStateContext } from "../contexts";

const AnnouncementFrame = ({ hideAnnouncement }) => {
  const [index, setIndex] = useState(0);
  const { isDarkTheme } = useContext(GlobalStateContext);
  const [activeKey, setActiveKey] = useState("1");
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    let timeOut;
    if (!hideAnnouncement) {
      timeOut = setTimeout(() => setActiveKey("0"), 20000);
    }
    return () => clearTimeout(timeOut);
  }, [hideAnnouncement]);

  function CustomToggle({ children, eventKey }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );
    const isCurrentEventKey = activeEventKey === eventKey;
    return (
      <>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => {
            decoratedOnClick();
            setActiveKey(activeKey === eventKey ? "1" : eventKey);
          }}
          className={classnames(
            "border d-flex align-items-center ms-auto mb-2 mb-md-0"
          )}
        >
          <FontAwesomeIcon
            className="icon-sm "
            icon={isCurrentEventKey ? faAngleUp : faAngleDown}
          />
        </Button>
      </>
    );
  }

  return (
    <Container
      className={classnames("mt-2", {
        "d-none": isEmpty(AnnouncementsList) || hideAnnouncement,
      })}
    >
      <Accordion activeKey={activeKey} className="position-relative">
        <CustomToggle eventKey="0" />
        <Accordion.Collapse eventKey="0">
          <>
            <Carousel
              interval={20000}
              indicators={false}
              activeIndex={index}
              variant={isDarkTheme ? "light" : "dark"}
              onSelect={handleSelect}
            >
              {map(
                AnnouncementsList,
                ({ link, openLinkInPopUp, imgSm, imgMd, imgLg }, key) => (
                  <Carousel.Item key={key}>
                    <div className="d-flex justify-content-center d-md-none">
                      <Image
                        onClick={() =>
                          openLinkInPopUp
                            ? CreatePopup(link, window.innerWidth)
                            : router.push(link)
                        }
                        className="cursor-pointer"
                        src={imgSm}
                        height={50}
                        layout="fixed"
                        alt="LobstrApp"
                        objectFit="contain"
                        quality={100}
                      />
                    </div>
                    <div className=" justify-content-center d-none d-md-flex d-lg-none">
                      <Image
                        onClick={() =>
                          openLinkInPopUp
                            ? CreatePopup(link, window.innerWidth)
                            : router.push(link)
                        }
                        className="cursor-pointer "
                        src={imgMd}
                        height={70}
                        layout="fixed"
                        alt="LobstrApp"
                        objectFit="contain"
                        quality={100}
                      />
                    </div>
                    <div className="justify-content-center d-none d-lg-flex">
                      <Image
                        onClick={() =>
                          openLinkInPopUp
                            ? CreatePopup(link, window.innerWidth)
                            : router.push(link)
                        }
                        className="cursor-pointer "
                        height={98}
                        src={imgLg}
                        layout="fixed"
                        alt="LobstrApp"
                        objectFit="contain"
                        quality={100}
                      />
                    </div>
                  </Carousel.Item>
                )
              )}
            </Carousel>
          </>
        </Accordion.Collapse>
      </Accordion>
    </Container>
  );
};

export default AnnouncementFrame;
