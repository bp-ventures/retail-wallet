import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { concat, filter, find, map, toLower } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import {
  Col,
  Container,
  FormControl,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import Partners from "../../consts/Partners.json";
import { ToasterContext } from "../../contexts";
import { AssetCard } from "../cards";
import { T } from "../translation";

const AnchorSelectionModal = ({
  isVisible,
  selectedAsset,
  onHide,
  onSelect,
  excludedItems = [],
}) => {
  const [list, setList] = useState([]);
  const [initialList, setInitialList] = useState(selectedAsset?.anchors);
  const { setToasterText } = useContext(ToasterContext);
  useEffect(() => {
    const getFilteredList = () => {
      const filteredList = filter(
        selectedAsset?.anchors,
        ({ name }) =>
          !find(
            excludedItems,
            (excludeItemName) => toLower(name) === toLower(excludeItemName)
          )
      );
      const partners = filter(Partners, ({ supportedAssets }) =>
        find(supportedAssets, (code) => code === selectedAsset?.code)
      );
      return concat(
        map(partners, (obj) => ({ ...obj, isPartner: true })),
        filteredList
      );
    };

    if (isVisible) {
      const filteredList = getFilteredList();
      setInitialList(filteredList);
      setList(filteredList);
    }
  }, [isVisible]);

  const onInputTextChange = (e) => {
    const searchString = e.target.value;
    if (searchString) {
      setList(
        filter(initialList, function ({ name, description }) {
          return (
            toLower(name).indexOf(toLower(searchString)) > -1 ||
            toLower(description).indexOf(toLower(searchString)) > -1
          );
        })
      );
    } else setList(initialList);
  };

  return (
    <Modal
      centered
      show={isVisible}
      onHide={() => {
        setList(initialList);
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <T>general.select_method</T>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <FontAwesomeIcon className="icon-sm text-muted" icon={faSearch} />
          </InputGroup.Text>
          <FormControl
            placeholder={T("anchorSelectionModal.type_an_anchor")}
            onChange={onInputTextChange}
          />
        </InputGroup>
        <Container>
          {map(list, (item, key) => (
            <Row
              key={key}
              className=" cursor-pointer modal-list-item rounded-3"
              onClick={() => {
                if (item?.name === "Moneygram - Coming soon") {
                  setToasterText(
                    "Deposit and withdraw via Moneygram is coming soon..."
                  );
                  return;
                }
                onSelect(item);
                setList(initialList);
                onHide();
              }}
            >
              <Col xs="12 py-2">
                <AssetCard
                  value={{
                    code: item.name,
                    icon: item.icon,
                    subText: item.description,
                  }}
                  imageContainerClassName="me-2"
                />
              </Col>
            </Row>
          ))}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default AnchorSelectionModal;
