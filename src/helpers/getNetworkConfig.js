import { toLower } from "lodash";
import StellarSdk from "stellar-sdk";

const publicNetwork = {
  network: StellarSdk.Networks.PUBLIC,
  url: "https://horizon.stellar.org",
};

const testnet = {
  network: StellarSdk.Networks.TESTNET,
  url: "https://horizon-testnet.stellar.org",
};

export const getNetworkConfig = () => {
  return toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK) === "public"
    ? publicNetwork
    : testnet;
};
