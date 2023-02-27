import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AssetCard } from "../cards";
import { AssetSelectionModal } from "../modals/";
import { T } from "../translation";

const AssetSelectionDropDown = ({
  selectedAsset,
  displayBalance,
  placeholder = <T>general.select</T>,
  onSelect,
  excludeAssets,
}) => {
  const [isAssetSelectionModalVisible, setIsAssetSelectionModalVisible] = useState(false);

  return (
    <div
      className="d-flex align-items-center cursor-pointer"
      onClick={() => {
        if (!isAssetSelectionModalVisible) setIsAssetSelectionModalVisible(true);
      }}
    >
      {selectedAsset ? (
        <AssetCard value={selectedAsset} valueClassName="ps-1" imageContainerClassName="me-1" />
      ) : (
        <span className="mb-0 fw-bold color-primary">{placeholder}</span>
      )}
      <FontAwesomeIcon className="color-primary icon-sm ms-1" icon={faAngleDown} />
      <AssetSelectionModal
        excludeAssets={excludeAssets}
        displayBalance={displayBalance}
        isAssetSelectionModalVisible={isAssetSelectionModalVisible}
        onHide={() => setIsAssetSelectionModalVisible(false)}
        onSelect={onSelect}
      />
    </div>
  );
};

export default AssetSelectionDropDown;
