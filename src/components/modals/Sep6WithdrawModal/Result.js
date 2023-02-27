import React from "react";
import { T } from "../../translation";
import { LabelValue } from "../components";

const Sep6WithdrawResult = ({ result }) => {
  const { eta, fee_fixed, fee_percent, min_amount, assetCode } = result;
  return (
    <>
      <LabelValue
        borderBottom
        label={`${T("transactions.anchor")}:`}
        value="apay.io"
      />
      <LabelValue
        borderBottom
        label={`${T("transactions.estimated_time")}:`}
        value={`${eta / 60}m`}
      />
      <LabelValue
        borderBottom
        label={`${T("transactions.minimum")} ${T("transactions.amount")}:`}
        value={`${min_amount} ${assetCode}`}
      />
      <LabelValue
        label={`${T("transactions.fee")}:`}
        value={`${fee_fixed} ${fee_percent ? `+ ${fee_percent}%` : ""}`}
      />
    </>
  );
};

export default Sep6WithdrawResult;
