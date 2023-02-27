import { toNumber } from "lodash";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts";
import * as freighter from "../walletIntegration/freighter";

const useTradeBusinessLogic = ({}) => {
  const { query, replace, push } = useRouter();
  const { isLoggedIn } = useContext(AuthContext);
  const [phase, setPhase] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowConnectButton, setIsShowConnectButton] = useState(false);
  const [showInstallSection, setShowInstallSection] = useState(false);
  const [showDepositSection, setShowDepositSection] = useState(false);
  const [isShowFreighterRefreshButton, setIsShowFreighterRefreshButton] = useState(false);

  const executePhaseOne = async () => {
    const isFreighterInstalled = freighter.isConnected();
    if (isFreighterInstalled) {
      replace({
        query: { ...query, phase: "2" },
      });
    } else {
      replace({
        query: { ...query, phase: "3" },
      });
    }
  };

  const executePhaseTwo = async () => {
    setIsLoading(false);
    setShowInstallSection(false);
    setIsShowConnectButton(true);
    setShowDepositSection(false);
  };

  const executePhaseThree = async () => {
    setIsLoading(false);
    setIsShowConnectButton(false);
    setShowInstallSection(true);
    setShowDepositSection(false);
  };

  const executePhaseFour = async () => {
    setIsLoading(false);
    setShowInstallSection(false);
    setIsShowConnectButton(false);
    setShowDepositSection(true);
  };

  useEffect(() => {
    if (phase !== 4 && isLoggedIn) {
      replace({
        query: { ...query, phase: "4" },
      });
    }
  }, [isLoggedIn, phase]);

  useEffect(() => {
    if (phase) {
      setIsLoading(true);
      switch (phase) {
        case 1:
          executePhaseOne();
          break;
        case 2:
          executePhaseTwo();
          break;
        case 3:
          executePhaseThree();
          break;
        case 4:
          executePhaseFour();
          break;

        default:
          break;
      }
    }
  }, [phase]);

  useEffect(() => {
    const { phase } = query;

    if (phase) {
      setPhase(toNumber(phase));
    } else {
      replace({
        query: { ...query, phase: "1" },
      });
    }
  }, [query]);

  const onClickInstallAlbedoLink = () => {
    replace({
      query: { ...query, extension: "albedo" },
    });
    window.open("https://albedo.link/install-extension/", "_blank");
    //CreatePopup("https://albedo.link/install-extension/", 1000);
  };

  const onClickInstallFreighterLink = () => {
    setIsShowFreighterRefreshButton(true);
    replace({
      query: { ...query, extension: "freighter" },
    });
    window.open("https://www.freighter.app/", "_blank");
    //CreatePopup("https://www.freighter.app/", 1024);
  };

  return {
    isLoggedIn,
    isLoading,
    isShowConnectButton,
    showInstallSection,
    showDepositSection,
    isShowFreighterRefreshButton,
    onClickInstallAlbedoLink,
    onClickInstallFreighterLink,
  };
};

export default useTradeBusinessLogic;
