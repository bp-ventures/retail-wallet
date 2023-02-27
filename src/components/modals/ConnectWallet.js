import classnames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { AuthContext, GlobalStateContext, ToasterContext } from "../../contexts";
import { addItem } from "../../lib/helpers/localStorageApp";
import { CreatePopup } from "../createPopup";
import { isInStandaloneMode } from "../../utils";
import * as freighter from "../../walletIntegration/freighter";
import LoginWithWallet from "../../walletIntegration/logins/";
import { WalletCard } from "../cards";
import { T } from "../translation";
import * as ga from "../../lib/helpers/ga";

const ConnectWalletModal = ({ isConnectModalVisible, toggleModal }) => {
  const { setIsLoggedIn, setPubKey, setConnectedWallet } = useContext(AuthContext);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [isRabetInstalled, setIsRabetInstalled] = useState(false);
  const [isXbullInstalled, setIsXbullInstalled] = useState(false);
  const { setToasterText } = useContext(ToasterContext);
  const { isDarkTheme } = useContext(GlobalStateContext);

  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) {
      setIsPWA(true);
    } else {
      setIsPWA(false);
    }
  }, []);

  useEffect(() => {
    let checkIfFreighterInstalled = "";
    if (isConnectModalVisible) {
      setIsFreighterInstalled(freighter.isConnected());
      checkIfFreighterInstalled = setInterval(() => setIsFreighterInstalled(freighter.isConnected()), 1000);
    }
    return () => clearInterval(checkIfFreighterInstalled);
  }, [isConnectModalVisible]);

  useEffect(() => {
    if (window.rabet) {
      setIsRabetInstalled(true);
    } else {
      setIsRabetInstalled(false);
    }
    if (window.xBullSDK) {
      setIsXbullInstalled(true);
    } else {
      setIsXbullInstalled(false);
    }
  });

  const Login = async ({ wallet }) => {
    const pubKey = await LoginWithWallet({ wallet, setToasterText });
    if (pubKey) {
      ga.event({ action: "login", params: { method: wallet } });
      setConnectedWallet(wallet);
      addItem("connectedWallet", wallet);
      addItem("pubKey", pubKey);
      setIsLoggedIn(true);
      setPubKey(pubKey);
      toggleModal();
    }
  };

  const loginWithXbull = async () => {
    if (window?.xBullSDK.isConnected) {
      Login({ wallet: "xbull" });
    } else {
      const permissions = await xBullSDK.connect({
        canRequestPublicKey: true,
        canRequestSign: true,
      });
      Login({ wallet: "xbull" });
    }
  };

  return (
    <Modal centered show={isConnectModalVisible} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <T>connectWalletModal.title</T>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <WalletCard
              label="Albedo"
              className="mb-2"
              icon="/img/albedo.svg"
              onClick={() => {
                Login({ wallet: "albedo" });
              }}
            />
          </Col>
          <Col
            className={classnames({
              "d-none": isPWA,
              "d-none d-md-block": !isPWA,
            })}
          >
            <WalletCard
              label={`${isFreighterInstalled ? "Freighter" : "Install Freighter"} `}
              className="mb-2 "
              icon={`/img/${isDarkTheme ? "freighter-dark" : "freighter"}.svg`}
              onClick={() => {
                isFreighterInstalled ? Login({ wallet: "freighter" }) : CreatePopup("https://www.freighter.app/", 1000);
              }}
            />
          </Col>
          <Col
            className={classnames({
              "d-none": isPWA,
              "d-none d-md-block": !isPWA,
            })}
          >
            <WalletCard
              label={`${isRabetInstalled ? "Rabet" : "Install Rabet"} `}
              className="mb-2 "
              icon="/img/rabet-logo.png"
              onClick={() => {
                isRabetInstalled ? Login({ wallet: "rabet" }) : CreatePopup("https://rabet.io/", 1000);
              }}
            />
          </Col>
          {/* Xbull for mobile screen only */}
          <Col
            className={classnames({
              "d-none": isPWA,
              "d-md-none": !isPWA,
            })}
          >
            <WalletCard
              label={`${isXbullInstalled ? "xBull" : "Install xBull"} `}
              className="mb-2"
              icon="/img/xbull-logo.png"
              onClick={() => {
                isXbullInstalled ? loginWithXbull() : CreatePopup("https://wallet.xbull.app/create-account", 1000);
              }}
            />
          </Col>
          {/* Xbull for desktop screen */}
          <Col
            className={classnames({
              "d-none": isPWA,
              "d-none d-md-block": !isPWA,
            })}
          >
            <WalletCard
              label={`${isXbullInstalled ? "xBull" : "Install xBull"} `}
              className="mb-2"
              icon="/img/xbull-logo.png"
              onClick={() => {
                isXbullInstalled ? loginWithXbull() : CreatePopup("https://xbull.app/installation/", 1000);
              }}
            />
          </Col>
          <Col
            className={classnames({
              "d-none": isPWA,
              "d-none d-md-block": !isPWA,
            })}
          >
            <WalletCard
              label="Ledger"
              className="mb-2"
              icon={`/img/${isDarkTheme ? "ledger-dark" : "ledger"}.svg`}
              onClick={() => {
                Login({ wallet: "ledger" });
              }}
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ConnectWalletModal;
