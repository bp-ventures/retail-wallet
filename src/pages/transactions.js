import classnames from "classnames";
import { get } from "lodash";
import { Button, Col, Container, Row } from "react-bootstrap";
import { LoadingButton } from "../components/buttons";
import {
  AssetSelectionDropDown,
  AnchorSelectionDropDown,
} from "../components/dropdowns";
import {
  Sep24Modal,
  Sep6DepositModal,
  Sep6WithdrawModal,
  Sep6PartnersWithdrawModal,
} from "../components/modals";
import { TransactionsTable } from "../components/tables";
import { T } from "../components/translation";
import { SiteConfigs } from "../consts";
import { useHandleTransactionScreenActions } from "../hooks/";

const Transactions = ({ setIsConnectModalVisible }) => {
  const {
    handleTransactionsScreenAction,
    setIsShowTransactions,
    setIsSep24ModalVisible,
    setIsSep6DepositModalVisible,
    setWithdrawResult,
    setIsSep6WithdrawModalVisible,
    setIsSep6WithdrawLoading,
    setIsSep6PartnersWithdrawModalVisible,
    setSelectedAsset,
    handleOnWithdrawBtnClick,
    setSelectedAnchor,
    selectedAnchor,
    isDeposit,
    withdrawResult,
    isSep6WithdrawLoading,
    isSep24ModalVisible,
    isShowTransactions,
    isSep6DepositModalVisible,
    isSep6WithdrawModalVisible,
    isSep6PartnersWithdrawModalVisible,
    selectedAsset,
    depositResult,
    isSep6DepositLoading,
    isShowTransactionsHistory,
  } = useHandleTransactionScreenActions({ setIsConnectModalVisible });

  return (
    <Container className="px-md-5">
      <main className="py-4">
        <Row>
          <Col
            xs="12"
            className="d-flex flex-column flex-md-row  justify-content-start align-items-md-center mb-3 overflow-auto"
          >
            <div className="d-flex">
              <AssetSelectionDropDown
                placeholder={T("transactions.select_token")}
                excludeAssets={["CNY"]}
                displayBalance
                selectedAsset={selectedAsset}
                onSelect={(value) => {
                  setSelectedAsset(value);
                  setSelectedAnchor();
                  setIsShowTransactions(false);
                }}
              />
              <AnchorSelectionDropDown
                className={classnames("ms-3", {
                  "d-none": !selectedAsset?.anchors,
                })}
                placeholder={T("general.select_method")}
                selectedAnchor={selectedAnchor}
                selectedAsset={selectedAsset}
                onSelect={(value) => {
                  setSelectedAnchor(value);
                  setIsShowTransactions(false);
                }}
              />
            </div>
            <div
              className={classnames("d-flex mt-2 pt-1 pt-md-0 mt-md-0", {
                "d-none": selectedAsset?.anchors && !selectedAnchor,
              })}
            >
              <LoadingButton
                className={classnames("me-2 ms-md-3 btn-sm btn-md-lg")}
                onClick={() => handleTransactionsScreenAction("deposit")}
              >
                <T>general.deposit</T>
              </LoadingButton>
              <LoadingButton
                className={classnames("me-2 btn-sm btn-md-lg")}
                onClick={handleOnWithdrawBtnClick}
              >
                <T>general.withdraw</T>
              </LoadingButton>
              <Button
                className={classnames("btn-sm btn-md-lg", {
                  "d-none": !isShowTransactionsHistory,
                  "d-none": selectedAnchor?.isPartner,
                })}
                onClick={() => handleTransactionsScreenAction("transactions")}
              >
                <T>general.transactions</T>
              </Button>
            </div>
          </Col>
          <TransactionsTable
            selectedAsset={selectedAsset}
            selectedAnchor={selectedAnchor}
            isShowTransactions={isShowTransactions}
            setIsConnectModalVisible={setIsConnectModalVisible}
          />
        </Row>
        {/* Modals */}
        <Sep24Modal
          isDeposit={isDeposit}
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
        <Sep6WithdrawModal
          handleTransactionsScreenAction={handleTransactionsScreenAction}
          selectedAsset={selectedAsset}
          result={withdrawResult}
          setResult={setWithdrawResult}
          selectedAnchor={selectedAnchor}
          isModalVisible={isSep6WithdrawModalVisible}
          isSep6WithdrawLoading={isSep6WithdrawLoading}
          setIsSep6WithdrawLoading={setIsSep6WithdrawLoading}
          toggleModal={() =>
            setIsSep6WithdrawModalVisible(!isSep6WithdrawModalVisible)
          }
        />
        <Sep6PartnersWithdrawModal
          handleTransactionsScreenAction={handleTransactionsScreenAction}
          selectedAsset={selectedAsset}
          result={withdrawResult}
          setResult={setWithdrawResult}
          selectedAnchor={selectedAnchor}
          isModalVisible={isSep6PartnersWithdrawModalVisible}
          isSep6WithdrawLoading={isSep6WithdrawLoading}
          setIsSep6WithdrawLoading={setIsSep6WithdrawLoading}
          toggleModal={() =>
            setIsSep6PartnersWithdrawModalVisible(
              !isSep6PartnersWithdrawModalVisible
            )
          }
        />
      </main>
    </Container>
  );
};

export const getServerSideProps = ({}) => {
  return {
    props: {
      title: `${get(SiteConfigs, "siteName")} - Deposit/Withdraw`,
    },
  };
};

export default Transactions;
