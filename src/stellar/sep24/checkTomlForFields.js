import { getHomeDomainFromAssetIssuer } from "./getHomeDomainFromAssetIssuer";
import { getToml } from "./getToml";
import { TomlFields, AnyObject } from "../../types/types.d";

export const checkTomlForFields = async ({
  sepName,
  assetIssuer,
  requiredKeys,
  networkUrl,
  homeDomain,
}) => {
  let homeDomainParam = homeDomain;

  if (!homeDomainParam) {
    homeDomainParam = await getHomeDomainFromAssetIssuer({
      assetIssuer,
      networkUrl,
    });
  }

  const tomlResponse = await getToml(homeDomainParam);

  const missingKeys = [];

  const result = requiredKeys.reduce((res, key) => {
    if (tomlResponse[key]) {
      return { ...res, [key]: tomlResponse[key].replace(/\/$/, "") };
    }

    missingKeys.push(`\`${key}\``);
    return res;
  }, {});

  if (missingKeys.length) {
    throw new Error(
      `TOML must contain a ${missingKeys.join(", ")} for ${sepName} transaction`
    );
  }

  return result;
};
