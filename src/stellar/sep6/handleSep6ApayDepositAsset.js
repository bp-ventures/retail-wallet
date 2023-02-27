import { programmaticDepositFlow } from ".";
import { getNetworkConfig } from "../../helpers";
import { TomlFields } from "../../types/types.d";
import { checkDepositWithdrawInfo } from "../checkDepositWithdrawInfo";
import { checkTomlForFields } from "../sep24/checkTomlForFields";
import { getHomeDomainFromAssetIssuer } from "../sep24/getHomeDomainFromAssetIssuer";

// import { trustAsset } from "./trustAsset";
const HandleSep6ApayDepositAsset = async (
  asset,
  pubKey,
  connectedWallet,
  setIsLoading,
  onHideModal
) => {
  const { code: assetCode, issuer: assetIssuer, homeDomain } = asset;
  const networkConfig = getNetworkConfig();
  const publicKey = pubKey;
  //  This is unlikely
  if (!homeDomain) {
    homeDomain = await getHomeDomainFromAssetIssuer({
      assetIssuer,
      networkUrl: networkConfig.url,
    });
  }

  // This is unlikely
  if (!publicKey) {
    throw new Error("Something is wrong with Account, no public key.");
  }

  // This is unlikely
  if (!homeDomain) {
    throw new Error("Something went wrong, home domain is not defined.");
  }

  // const trustAssetCallback = async () => {
  //   const assetString = `${assetCode}:${assetIssuer}`;

  //   await trustAsset({
  //     networkPassphrase: networkConfig.network,
  //     networkUrl: networkConfig.url,
  //     untrustedAsset: {
  //       assetString,
  //       assetCode,
  //       assetIssuer,
  //     },
  //   });

  //   return assetString;
  // };

  try {
    // Check toml
    const tomlResponse = await checkTomlForFields({
      sepName: "SEP-6 deposit",
      assetIssuer,
      requiredKeys: [TomlFields.TRANSFER_SERVER],
      networkUrl: networkConfig.url,
      homeDomain,
    });

    const transferServerUrl = tomlResponse.TRANSFER_SERVER;

    // Check info
    await checkDepositWithdrawInfo({
      type: "deposit",
      transferServerUrl,
      assetCode,
    });

    const depositResponse = await programmaticDepositFlow({
      assetCode,
      publicKey,
      transferServerUrl,
    });

    return depositResponse;
  } catch (error) {
    // setIsLoading(false);
    // onHideModal();
    // setToasterText(toString(error));
    alert(error);
  }
};

export default HandleSep6ApayDepositAsset;
