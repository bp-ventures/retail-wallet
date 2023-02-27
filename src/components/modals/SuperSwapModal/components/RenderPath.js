import { isEmpty, map } from "lodash";

const RenderPath = ({ path, sendingAsset, receivingAsset }) => {
  if (isEmpty(path)) return null;
  return (
    <div className="text-center">
      <p className="mb-2">
        Based on current prices we will do a <br /> path payment for the full
        amount.
      </p>
      <span>Path: {sendingAsset?.code} </span> &#8594;
      {map(path, ({ asset_code, asset_type }, index) => (
        <>
          <span> {`${asset_type === "native" ? "XLM" : asset_code}`} </span>
          &#8594;
        </>
      ))}
      <span> {receivingAsset?.code}</span>
    </div>
  );
};

export default RenderPath;
