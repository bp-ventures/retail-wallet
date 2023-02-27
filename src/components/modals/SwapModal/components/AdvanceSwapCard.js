import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { find, get, includes, round } from "lodash";
import { useContext } from "react";
import {
  Accordion,
  AccordionContext,
  Form,
  useAccordionButton,
} from "react-bootstrap";
import Toggle from "react-toggle";
import { checkIfNative } from "../../../../utils";
import { T } from "../../../translation";
import { RenderDetailsCardRow } from "../../components/";

function CustomToggle({ eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!")
  );
  const { activeEventKey } = useContext(AccordionContext);
  const isCurrentEventKey = activeEventKey === eventKey;
  return (
    <p
      onClick={decoratedOnClick}
      className="text-end mt-1 cursor-pointer mb-0 fw-bold"
    >
      <T>swapModal.advanced</T>
      <FontAwesomeIcon
        className="icon-sm ms-2 "
        icon={isCurrentEventKey ? faAngleUp : faAngleDown}
      />
    </p>
  );
}

const findReserve = (reserves, assetCode) =>
  round(
    get(
      find(reserves, (obj) => includes(obj.asset, checkIfNative(assetCode))),
      "amount",
      0
    ),
    2
  );

const AdvanceSwapCard = ({
  isFetchingLiquidityPools,
  isFetchingOffers,
  sellingPrice,
  buyingPrice,
  reserves,
  asset,
  toAsset,
  isSuperSwapSelected,
  setIsSuperSwapSelected,
}) => {
  const lpSizeFromAsset = findReserve(reserves, asset.code);
  const lpSizeToAsset = findReserve(reserves, toAsset.code);
  return (
    <Accordion>
      <CustomToggle eventKey="0" />
      <Accordion.Collapse eventKey="0">
        <>
          <RenderDetailsCardRow
            borderTop
            isLoading={isFetchingOffers}
            label={<T>swapModal.bid_offer</T>}
            value={`<small>${T("swapModal.selling")}:</small> ${round(
              sellingPrice,
              3
            )} <br/> <small>${T("swapModal.buying")}:</small> ${
              buyingPrice ? round(1 / buyingPrice, 3) : "NA"
            }`}
            toolTipText={<T>swapModal.bid_offer_tooltip</T>}
          />
          <RenderDetailsCardRow
            borderTop
            isLoading={isFetchingLiquidityPools}
            label="LP"
            value={`<small>Price:</small> ${round(
              1 / (lpSizeFromAsset / lpSizeToAsset),
              2
            )} <br/> <small>Amt ${
              asset.code
            }:</small> ${lpSizeFromAsset} <br/> <small>Amt ${
              toAsset.code
            }:</small> ${lpSizeToAsset} <br/> <small>Fee: 0.30%</small>`}
            toolTipText={<T>swapModal.lp_size_tooltip</T>}
          />
          <RenderDetailsCardRow
            borderTop
            label={<T>swapModal.super_swap</T>}
            toolTipText={<T>swapModal.advanced_swap_tooltip</T>}
          >
            <Form className="mt-2 d-flex flex-column  justify-content-end align-items-start">
              <Toggle
                className="react-toggle-custom"
                checked={isSuperSwapSelected}
                onChange={() => {
                  setIsSuperSwapSelected(!isSuperSwapSelected);
                }}
                aria-label="Super Swap"
              />
            </Form>
          </RenderDetailsCardRow>
        </>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default AdvanceSwapCard;
