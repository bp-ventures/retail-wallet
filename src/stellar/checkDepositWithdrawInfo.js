import { get } from "lodash";

export const checkDepositWithdrawInfo = async ({
  type,
  transferServerUrl,
  assetCode,
}) => {
  const infoURL = `${transferServerUrl}/info`;

  const info = await fetch(infoURL);
  const infoJson = await info.json();

  if (!get(infoJson, [type, assetCode, "enabled"])) {
    throw new Error("Asset is not enabled in the `/info` endpoint");
  }

  return infoJson;
};
