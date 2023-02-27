import classnames from "classnames";
import { get } from "lodash";
import { Button, Container, Row } from "react-bootstrap";
import { LoadingWrapper } from "../components/";
import { Sep24Modal, Sep6DepositModal } from "../components/modals";
import {
  InstallationSection,
  DepositSection,
} from "../components/pagesComponents/trade";
import { T } from "../components/translation";
import { SiteConfigs } from "../consts";
import { useHandleTransactionScreenActions } from "../hooks";
import useTradeBusinessLogic from "../hooks/useTradeBusinessLogic";

const Trade = ({ setIsConnectModalVisible }) => {
  const {
    isLoading,
    isShowConnectButton,
    showInstallSection,
    showDepositSection,
    isShowFreighterRefreshButton,
    isLoggedIn,
    onClickInstallAlbedoLink,
    onClickInstallFreighterLink,
  } = useTradeBusinessLogic({});

  const {
    selectedAnchor,
    isSep6DepositModalVisible,
    selectedAsset,
    depositResult,
    isSep6DepositLoading,
    isSep24ModalVisible,
    setIsSep6DepositModalVisible,
    setSelectedAsset,
    setSelectedAnchor,
    setIsSep24ModalVisible,
    handleTransactionsScreenAction,
  } = useHandleTransactionScreenActions({ setIsConnectModalVisible });
  return (
    <Container className="px-md-5">
      <main className="py-4 d-flex justify-content-center">
        <LoadingWrapper isLoading={isLoading} className="mx-auto">
          <Row className="mt-4 mt-md-5 px-3">
            <Button
              className={classnames("border-0 w-100", {
                "d-none": !isShowConnectButton,
              })}
              onClick={() => setIsConnectModalVisible(true)}
            >
              <T>general.connect</T>
            </Button>

            <InstallationSection
              showInstallSection={showInstallSection}
              setIsConnectModalVisible={setIsConnectModalVisible}
              onClickInstallAlbedoLink={onClickInstallAlbedoLink}
              onClickInstallFreighterLink={onClickInstallFreighterLink}
              isShowFreighterRefreshButton={isShowFreighterRefreshButton}
            />

            <DepositSection
              showDepositSection={showDepositSection}
              setSelectedAsset={setSelectedAsset}
              setSelectedAnchor={setSelectedAnchor}
              selectedAsset={selectedAsset}
              handleTransactionsScreenAction={handleTransactionsScreenAction}
            />
          </Row>
        </LoadingWrapper>
        <Sep24Modal
          isDeposit={true}
          selectedAsset={selectedAsset}
          selectedAnchor={selectedAnchor}
          isModalVisible={isSep24ModalVisible}
          toggleModal={() => setIsSep24ModalVisible(!isSep24ModalVisible)}
        />
        <Sep6DepositModal
          selectedAsset={selectedAsset}
          selectedAnchor={selectedAnchor}
          depositResult={depositResult}
          isSep6DepositLoading={isSep6DepositLoading}
          isModalVisible={isSep6DepositModalVisible}
          toggleModal={() =>
            setIsSep6DepositModalVisible(!isSep6DepositModalVisible)
          }
        />
      </main>
    </Container>
  );
};

export const getServerSideProps = ({}) => {
  return {
    props: {
      title: `${get(SiteConfigs, "siteName")} - Trade`,
      hideAnnouncement: true,
    },
  };
};

export default Trade;
