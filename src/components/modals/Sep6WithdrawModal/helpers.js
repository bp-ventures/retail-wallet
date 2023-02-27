import { getNetworkConfig } from "../../../helpers";
import { checkDepositWithdrawInfo } from "../../../stellar/checkDepositWithdrawInfo";
import { checkTomlForFields } from "../../../stellar/sep24/checkTomlForFields";
import { getHomeDomainFromAssetIssuer } from "../../../stellar/sep24/getHomeDomainFromAssetIssuer";
import { TomlFields } from "../../../types/types.d";

export const getAssetInfo = async ({ asset }) => {
  try {
    const { code: assetCode, issuer: assetIssuer, homeDomain } = asset;
    const networkConfig = getNetworkConfig();

    //  This is unlikely
    if (!homeDomain) {
      homeDomain = await getHomeDomainFromAssetIssuer({
        assetIssuer,
        networkUrl: networkConfig.url,
      });
    }
    const tomlResponse = await checkTomlForFields({
      sepName: "SEP-6 withdraw",
      assetIssuer,
      requiredKeys: [TomlFields.TRANSFER_SERVER],
      networkUrl: networkConfig.url,
      homeDomain,
    });
    // Check info
    const infoResponse = await checkDepositWithdrawInfo({
      type: "withdraw",
      transferServerUrl: tomlResponse.TRANSFER_SERVER,
      assetCode,
    });
    return infoResponse;
  } catch (error) {
    throw error;
  }
};
