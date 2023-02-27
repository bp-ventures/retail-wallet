import StellarSDK from "stellar-sdk";

export default function getAssetDetails(asset) {
  if (asset.code !== "XLM" && asset.code && asset.issuer) {
    return new StellarSDK.Asset(asset.code, asset.issuer);
  }

  return new StellarSDK.Asset.native(); // eslint-disable-line
}
