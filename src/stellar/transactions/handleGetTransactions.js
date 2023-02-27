import { toLower } from "lodash";
import { SignTrx } from "../";
import { getNetworkConfig } from "../../helpers";
import { TomlFields } from "../../types/types.d.js";
import { sep10AuthSend, sep10AuthStart } from "../sep10Auth";
import { checkTomlForFields } from "../sep24/checkTomlForFields";
import { getHomeDomainFromAssetIssuer } from "../sep24/getHomeDomainFromAssetIssuer";
import { getTransactions } from "./getTransactions";
import {
  addTransactionToken,
  getTransactionToken,
} from "../../lib/helpers/localStorageApp";
import { isJwtExpired } from "jwt-check-expiration";

const handleGetTransactions = async (
  asset,
  pubKey,
  connectedWallet,
  setIsSigningWithLedger
) => {
  const { code: assetCode, issuer: assetIssuer, homeDomain } = asset;
  let token = "";
  // const { data, secretKey } = accountSelector(getState());
  // const { pubnet, claimableBalanceSupported } = settingsSelector(getState());
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

  // // This is unlikely
  // if (!homeDomain) {
  //   throw new Error("Something went wrong, home domain is not defined.");
  // }

  try {
    // Check toml

    const tomlResponse = await checkTomlForFields({
      sepName: "Transactions",
      assetIssuer,
      requiredKeys: [
        TomlFields.SIGNING_KEY,
        TomlFields.TRANSFER_SERVER_SEP0024,
        TomlFields.WEB_AUTH_ENDPOINT,
      ],
      networkUrl: networkConfig.url,
      homeDomain,
    });

    //Checking if the token is previously fetched and still valid
    const savedToken = getTransactionToken({
      publicKey,
      authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
    });

    if (savedToken && !isJwtExpired(savedToken)) {
      token = savedToken;
    } else {
      //Token does'nt exist
      // SEP-10 start
      const challengeTransaction = await sep10AuthStart({
        authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
        serverSigningKey: tomlResponse.SIGNING_KEY,
        publicKey,
        homeDomain,
      });
      // SEP-10 sign

      const signedChallengeTransaction = await SignTrx(
        connectedWallet,
        challengeTransaction,
        toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
        publicKey,
        setIsSigningWithLedger
      );

      // SEP-10 send
      token = await sep10AuthSend({
        authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
        signedChallengeTransaction,
      });

      addTransactionToken({
        token,
        publicKey,
        authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
      });
    }

    // const token = await getToken({ authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT });
    // Check info
    const transactions = await getTransactions({
      type: "deposit",
      toml: tomlResponse,
      token,
      assetCode,
    });
    return transactions;
  } catch (error) {
    throw error;
  }
};

export default handleGetTransactions;
