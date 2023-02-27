import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { filter, isEmpty, map, round, size, toLower, toNumber, toString } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import AssetsList from "../../consts/AssetsList.json";
import { AuthContext, GlobalStateContext, ToasterContext } from "../../contexts";
import { useFetchBalances } from "../../hooks";
import * as stellar from "../../stellar";
import { AssetCard, AvailableBalanceCard } from "../cards";
import LoadingWrapper from "../LoadingWrapper";
import { T } from "../translation";

const AddAssetModal = ({ isModalVisible, displayBalance, onHide }) => {
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const { pubKey, connectedWallet, refreshBalances, setRefreshBalances } = useContext(AuthContext);
  const { setIsSigningWithLedger } = useContext(GlobalStateContext);
  const { setToasterText, setIsSuccess } = useContext(ToasterContext);
  const [isAddingTrustLine, setIsAddingTrustLine] = useState(false);

  const { balances, isFetchingBalances } = useFetchBalances({
    dependencyArray: [isModalVisible, pubKey],
  });

  useEffect(() => {
    const getFilteredAssets = () =>
      filter(
        AssetsList,
        ({ showOnDashboardByDefault, code, issuer }) =>
          !showOnDashboardByDefault && !stellar.hasTrust(balances, code, issuer)
      );
    if (size(balances) > 0) {
      const filteredAssets = getFilteredAssets();
      setInitialList(filteredAssets);
      setList(filteredAssets);
    }
  }, [balances]);

  const onInputTextChange = (e) => {
    const assetToSearch = e.target.value;
    if (assetToSearch)
      setList(
        filter(initialList, function ({ code }) {
          return toLower(code).indexOf(toLower(assetToSearch)) > -1;
        })
      );
    else setList(initialList);
  };

  const onSelect = async (asset) => {
    setIsAddingTrustLine(true);
    try {
      await stellar.addTrustLine({
        pubKey,
        asset,
        connectedWallet,
        setIsSigningWithLedger,
      });
      setRefreshBalances(!refreshBalances);

      setIsSuccess(true);
      setToasterText("messages.trustline_added_successfully");
    } catch (error) {
      setIsSuccess(false);
      setToasterText(stellar.getMeaningfulErrorMessage(error), toString(error));
    }
    setIsAddingTrustLine(false);
    onHide();
  };
  return (
    <Modal
      centered
      show={isModalVisible}
      onHide={() => {
        setList(initialList);
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <T>assetSelectionModal.select_asset</T>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup
          className={classnames("mb-3", {
            "d-none": isEmpty(initialList),
          })}
        >
          <InputGroup.Text id="basic-addon1">
            <FontAwesomeIcon className="icon-sm text-muted" icon={faSearch} />
          </InputGroup.Text>
          <FormControl placeholder={T("assetSelectionModal.type_a_cryptocurrency")} onChange={onInputTextChange} />
        </InputGroup>
        <Container>
          <LoadingWrapper isLoading={isFetchingBalances || isAddingTrustLine}>
            {isEmpty(list) ? (
              <p>No asset found!</p>
            ) : (
              map(list, (asset, key) => {
                const { balance, selling_liabilities } = stellar.destructBalance(
                  balances,
                  asset?.code,
                  asset?.issuer,
                  true
                );
                let availableBalance = 0;
                if (balance) {
                  availableBalance = round(toNumber(balance) - toNumber(selling_liabilities), 7);
                }

                return (
                  <Row key={key} className="cursor-pointer modal-list-item rounded-3" onClick={() => onSelect(asset)}>
                    <Col xs="12 d-flex align-items-center justify-content-between py-2  ">
                      <AssetCard value={asset} imageContainerClassName="me-2" />
                      <div
                        className={classnames({
                          "d-none": !pubKey || !displayBalance,
                        })}
                      >
                        <AvailableBalanceCard
                          className={classnames({
                            "d-none": isFetchingBalances ? false : availableBalance < 0.000001,
                          })}
                          balance={availableBalance}
                          isLoading={isFetchingBalances}
                        />
                      </div>
                    </Col>
                  </Row>
                );
              })
            )}
          </LoadingWrapper>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AddAssetModal;
