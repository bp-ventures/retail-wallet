import { faCopy, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { map, toLower } from "lodash";
import Image from "next/image";
import router from "next/router";
import React, { useContext } from "react";
import { Button, Col, Container, Nav, Navbar } from "react-bootstrap";
import { DarkModeToggle } from "../../components";
import { LanguageSelector } from "../../components/dropdowns";
import { T } from "../../components/translation";
import { SiteConfigs } from "../../consts";
import {
  AuthContext,
  GlobalStateContext,
  ToasterContext,
} from "../../contexts";
import { clearItem } from "../../lib/helpers/localStorageApp";
import { openLinkInNewTab, truncateFromCenter } from "../../utils";
import navLinksList from "./navLinks.json";
const { siteName } = SiteConfigs;
import * as ga from "../../lib/helpers/ga";

const BootStrapNavBar = ({ setIsConnectModalVisible }) => {
  const { pubKey, setIsLoggedIn, setPubKey, setBalances } = useContext(
    AuthContext
  );
  const { getBootStrapComponentVariant } = useContext(GlobalStateContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);

  const logout = () => {
    ga.event({ action: "logout", params: { event_category: "engagement" } });
    setIsLoggedIn(false);
    setPubKey("");
    setBalances([]);
    clearItem("pubKey");
    clearItem("connectedWallet");
  };

  const onClick = () => {
    if (pubKey) {
      setIsSuccess(true);
      setToasterText(() => T("messages.copied"));
      navigator.clipboard.writeText(pubKey);
    } else setIsConnectModalVisible(true);
  };

  const navigateToNetwork = () => {
    if (pubKey) {
      return openLinkInNewTab(
        `https://stellar.expert/explorer/${toLower(
          process.env.NEXT_PUBLIC_ALBEDO_NETWORK
        )}/account/${pubKey}`
      );
    } else return "#";
  };

  const ConnectBtn = ({ className }) => (
    <Button
      className={classnames(" border-0 w-100", className)}
      onClick={onClick}
    >
      {pubKey ? (
        <Col className="d-flex align-items-center">
          <span className="d-none d-md-block">
            {truncateFromCenter(pubKey, 15)}
          </span>
          <FontAwesomeIcon
            className="icon-sm ms-md-2"
            icon={faCopy}
            title={T("general.copy")}
          />
          <span className="d-md-none ms-2">
            {truncateFromCenter(pubKey, 15)}
          </span>
        </Col>
      ) : (
        <T>general.connect</T>
      )}
    </Button>
  );

  const LogOutBtn = () =>
    pubKey ? (
      <div
        role="button"
        onClick={logout}
        className="d-flex align-items-center justify-content-end"
      >
        <strong>
          <p className="text-muted me-0 mb-0 ms-lg-3">
            <T>general.logout</T>
          </p>
        </strong>
        <FontAwesomeIcon
          icon={faSignOutAlt}
          className="logout-icon ms-2 color-primary cursor-pointer "
        />
      </div>
    ) : (
      <></>
    );

  const HistoryLink = () => (
    <Nav.Link
      key="history-link"
      className={classnames("text-muted", {
        "d-none": !pubKey,
      })}
      onClick={navigateToNetwork}
      eventKey="3"
    >
      <strong>
        <T>navbar.history</T>
      </strong>
    </Nav.Link>
  );

  return (
    <Navbar
      variant={getBootStrapComponentVariant()}
      collapseOnSelect
      className="border-bottom sticky-top header-bg "
      expand="lg"
    >
      <Container>
        <div className="d-flex flex-row align-items-center">
          <Navbar.Brand
            onClick={() => router.push("/")}
            className="align-items-center d-flex logo-container cursor-pointer me-0"
          >
            <div className="logo">
              <Image src="/img/logo.png" alt={siteName} layout="fill" />
            </div>
            <strong className="color-primary">
              <T>general.home</T>
            </strong>
          </Navbar.Brand>
          <small className="ms-1 cursor-pointer">
            <div className="fnt-14" onClick={navigateToNetwork}>
              (
              {toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK) === "public" ? (
                <T>general.public</T>
              ) : (
                "testnet"
              )}
              )
            </div>
          </small>
        </div>
        <Nav.Link key="dark-sm" className="d-flex d-md-none">
          <DarkModeToggle />
        </Nav.Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav
            className="d-flex align-items-lg-center ms-auto my-2 my-lg-0 text-end text-lg-start"
            navbarScroll
          >
            <Nav.Link key="connect-sm" className="d-lg-none">
              <ConnectBtn />
            </Nav.Link>
            <Nav.Link key="dark-mode-md" className="d-none d-md-flex">
              <DarkModeToggle className="ms-auto" />
            </Nav.Link>
            {map(navLinksList, ({ name, route, eventKey }, key) => (
              <Nav.Link
                key={key}
                onClick={() => router.push(route)}
                eventKey={key + 1}
              >
                <strong>
                  <T>{name}</T>
                </strong>
              </Nav.Link>
            ))}

            <Nav.Link
              key="language-selector"
              className="d-flex justify-content-end"
            >
              <LanguageSelector />
            </Nav.Link>
            <div className="d-md-none">
              <HistoryLink />
            </div>
            <Nav.Link key="logout-sm" className="d-md-none">
              <LogOutBtn />
            </Nav.Link>
          </Nav>
          <div
            key="buttons-lg"
            className="d-flex align-items-center p-0 mt-2 mt-md-0 d-none d-lg-flex"
          >
            <ConnectBtn className="" />
            <HistoryLink />
            <LogOutBtn />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BootStrapNavBar;
