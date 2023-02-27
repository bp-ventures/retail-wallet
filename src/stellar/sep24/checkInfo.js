import { get } from "lodash";

export const checkInfo = async ({ type, toml, assetCode }) => {
  const infoURL = `${toml.TRANSFER_SERVER_SEP0024}/info`;
  const info = await fetch(infoURL);
  const infoJson = await info.json();

  if (!get(infoJson, [type, assetCode, "enabled"])) {
    throw "messages.asset_disabled_by_anchor";
  }
  return infoJson;
};
