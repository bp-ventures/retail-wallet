import Image from "next/image";
import React, { useContext } from "react";
import classnames from "classnames";
import { AuthContext } from "../../contexts";
import { find, get } from "lodash";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const AssetCard = ({
  valueClassName,
  showAssetDescription,
  imageContainerClassName,
  value: { code, subText, icon },
}) => {
  const { assetDescriptions } = useContext(AuthContext);
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 200, hide: 300 }}
      overlay={
        showAssetDescription ? (
          <Tooltip id="button-tooltip">
            {get(
              find(assetDescriptions, { code }),
              "desc",
              "No description found"
            )}
          </Tooltip>
        ) : (
          <></>
        )
      }
    >
      <div className="g-0 align-items-center d-flex ">
        <div
          className={classnames(
            "d-flex  position-relative  asset-icon",
            imageContainerClassName
          )}
        >
          <Image alt={code} src={icon} layout="fill" />
        </div>
        <div className={valueClassName}>
          <p className="mb-0">{code}</p>
          {subText && (
            <p className="text-muted mb-0">
              <small> {subText}</small>
            </p>
          )}
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default AssetCard;
