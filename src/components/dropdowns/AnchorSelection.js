import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import React, { useState } from "react";
import { AssetCard } from "../cards";
import { AnchorSelectionModal } from "../modals";
import { T } from "../translation";

const AnchorSelectionDropDown = ({
  selectedAsset,
  selectedAnchor,
  placeholder = <T>general.select</T>,
  onSelect,
  className,
}) => {
  const [
    isAnchorSelectionModalVisible,
    setIsAnchorSelectionModalVisible,
  ] = useState(false);

  return (
    <div
      className={classnames(
        "d-flex align-items-center cursor-pointer",
        className
      )}
      onClick={() => {
        if (!isAnchorSelectionModalVisible)
          setIsAnchorSelectionModalVisible(true);
      }}
    >
      {selectedAnchor ? (
        <AssetCard
          value={{ code: selectedAnchor.name, icon: selectedAnchor.icon }}
          valueClassName="ps-1"
          imageContainerClassName="me-1"
        />
      ) : (
        <span className="mb-0 fw-bold color-primary">{placeholder}</span>
      )}
      <FontAwesomeIcon
        className="color-primary icon-sm ms-1"
        icon={faAngleDown}
      />
      <AnchorSelectionModal
        selectedAsset={selectedAsset}
        isVisible={isAnchorSelectionModalVisible}
        onHide={() => setIsAnchorSelectionModalVisible(false)}
        onSelect={onSelect}
      />
    </div>
  );
};

export default AnchorSelectionDropDown;
