import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { add, filter, find, map, orderBy, round, size, toLower, toNumber } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import AssetsList from "../../consts/AssetsList.json";
import { AuthContext } from "../../contexts";
import { useFetchBalances } from "../../hooks";
import * as stellar from "../../stellar";
import { AssetCard, AvailableBalanceCard } from "../cards";
import { T } from "../translation";

const AssetSelectionModal = ({ isAssetSelectionModalVisible, displayBalance, onHide, onSelect, excludeAssets }) => {
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState();
  const { pubKey } = useContext(AuthContext);
  const { balances, isFetchingBalances } = useFetchBalances({
    dependencyArray: [isAssetSelectionModalVisible, pubKey, displayBalance],
  });

  const addBalanceInList = (filteredList) => {
    const listWithBalances = map(filteredList ? filteredList : list, (asset) => {
      const { balance, selling_liabilities } = stellar.destructBalance(balances, asset?.code, asset?.issuer, true);
      let availableBalance = 0;
      if (balance) {
        availableBalance = round(toNumber(balance) - toNumber(selling_liabilities), 7);
      }

      return { ...asset, balance, availableBalance, selling_liabilities };
    });
    setList(listWithBalances);
  };
  useEffect(() => {
    const getFilteredAssets = () =>
      filter(AssetsList, ({ code }) => !find(excludeAssets, (excludeAssetCode) => code === excludeAssetCode));
    const filteredAssets = getFilteredAssets();
    setInitialList(filteredAssets);
    setList(filteredAssets);
    addBalanceInList(filteredAssets);
  }, [excludeAssets]);

  useEffect(() => {
    if (isAssetSelectionModalVisible && displayBalance && size(balances) > 0) {
      addBalanceInList();
    }
  }, [balances, displayBalance, isAssetSelectionModalVisible]);

  const onInputTextChange = (e) => {
    const assetToSearch = e.target.value;
    if (assetToSearch)
      setList(
        filter(list, function ({ code }) {
          return toLower(code).indexOf(toLower(assetToSearch)) > -1;
        })
      );
    else {
      displayBalance ? addBalanceInList(initialList) : setList(initialList);
    }
  };

  return (
    <Modal
      centered
      show={isAssetSelectionModalVisible}
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
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <FontAwesomeIcon className="icon-sm text-muted" icon={faSearch} />
          </InputGroup.Text>
          <FormControl placeholder={T("assetSelectionModal.type_a_cryptocurrency")} onChange={onInputTextChange} />
        </InputGroup>
        <Container>
          {map(orderBy(list, "availableBalance", "desc"), (asset, key) => {
            return (
              <Row
                key={key}
                className="cursor-pointer modal-list-item rounded-3"
                onClick={() => {
                  onSelect(asset);
                  setList(AssetsList);
                  onHide();
                }}
              >
                <Col xs="12 d-flex align-items-center justify-content-between py-2  ">
                  <AssetCard value={asset} imageContainerClassName="me-2" />
                  <div
                    className={classnames({
                      "d-none": !pubKey || !displayBalance,
                    })}
                  >
                    <AvailableBalanceCard
                      className={classnames({
                        "d-none": isFetchingBalances ? false : asset?.availableBalance < 0.000001,
                      })}
                      balance={asset?.availableBalance}
                      isLoading={isFetchingBalances}
                    />
                  </div>
                </Col>
              </Row>
            );
          })}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AssetSelectionModal;
