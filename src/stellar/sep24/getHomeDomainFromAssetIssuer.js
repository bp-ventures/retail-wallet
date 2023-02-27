import StellarSdk from "stellar-sdk";

export const getHomeDomainFromAssetIssuer = async ({
  assetIssuer,
  networkUrl,
}) => {
  const server = new StellarSdk.Server(networkUrl);
  const accountRecord = await server.loadAccount(assetIssuer);
  const homeDomain = accountRecord.home_domain;

  if (!homeDomain) {
    throw new Error(
      `Asset issuer ${assetIssuer} does not have home domain configured`
    );
  }

  return homeDomain;
};
