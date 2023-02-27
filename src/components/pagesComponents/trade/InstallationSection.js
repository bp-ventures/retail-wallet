import { Button } from "react-bootstrap";
import classnames from "classnames";
import { useContext } from "react";
import { AuthContext } from "../../../contexts";
import { T } from "../../translation";
const InstallationSection = ({
  showInstallSection,
  setIsConnectModalVisible,
  onClickInstallAlbedoLink,
  onClickInstallFreighterLink,
  isShowFreighterRefreshButton,
}) => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <p className={classnames({ "d-none": !showInstallSection })}>
      First you need to install either Freighter or Albedo wallets in your
      browser. Ensure you have saved your private key, password, and/or
      pass-phrase.
      <br />
      <br />
      Freighter can be found here:{" "}
      <a onClick={onClickInstallFreighterLink} href="#">
        https://www.freighter.app/
      </a>
      {isShowFreighterRefreshButton && (
        <span className="ms-2">
          (Already installed Freighter?{" "}
          <a href="#" onClick={() => location.reload()}>
            Refresh the Page
          </a>
          ){" "}
        </span>
      )}
      <br />
      <br />
      You can find Albedo here: &nbsp;
      <a onClick={onClickInstallAlbedoLink} href="#">
        https://albedo.link/install-extension/
      </a>
      &nbsp; or run it directly from their website.
      <br />
      <br />
      <p className={classnames({ "d-none": isLoggedIn })}>
        Come back here when this is complete and refresh your screen.
      </p>
      <Button
        className={classnames("mx-auto d-flex", { "d-none": isLoggedIn })}
        onClick={() => setIsConnectModalVisible(true)}
      >
        <T>general.connect</T>
      </Button>
    </p>
  );
};

export default InstallationSection;
