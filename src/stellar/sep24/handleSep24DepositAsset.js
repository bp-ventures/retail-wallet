import { find, get, toLower, toString } from "lodash";
import { getNetworkConfig } from "../../helpers";
import { TomlFields } from "../../types/types.d";
import { SignTrx } from "../index";
import { sep10AuthSend, sep10AuthStart } from "../sep10Auth";
import { checkInfo } from "./checkInfo";
const StellarSdk = require("stellar-sdk");
// import { getErrorMessage } from "../../helpers";
import { isJwtExpired } from "jwt-check-expiration";
import { CreatePopup } from "../../components/createPopup";
import { AssetsList } from "../../consts";
import {
  addTransactionToken,
  getTransactionToken
} from "../../lib/helpers/localStorageApp";
import * as stellar from "./../../stellar";
import { checkTomlForFields } from "./checkTomlForFields";
import { getHomeDomainFromAssetIssuer } from "./getHomeDomainFromAssetIssuer";
import { interactiveDepositFlow } from "./interactiveDepositFlow";
import { pollDepositUntilComplete } from "./pollDepositUntilComplete";
import { trustAsset } from "./trustAsset";

const Sep24DepositAsset = async ({
  selectedAnchor,
  asset,
  pubKey,
  connectedWallet,
  setIsLoading,
  onHideModal,
  setToasterText,
  setIsSigningWithLedger,
}) => {
  let token = "";
  const { code: assetCode, issuer: assetIssuer, homeDomain } = asset;
  const networkConfig = getNetworkConfig();
  const publicKey = pubKey;
  const claimableBalanceSupported = false;
  //  This is unlikely
  if (!homeDomain) {
    const customHomeDomain = get(
      find(asset?.anchors, { name: selectedAnchor?.name }),
      "homeDomain"
    );
    if (customHomeDomain) {
      homeDomain = customHomeDomain;
    } else {
      homeDomain = await getHomeDomainFromAssetIssuer({
        assetIssuer,
        networkUrl: networkConfig.url,
      });
    }
  }

  // This is unlikely
  if (!publicKey) {
    throw new Error("Something is wrong with Account, no public key.");
  }

  // // This is unlikely
  // if (!homeDomain) {
  //   throw new Error("Something went wrong, home domain is not defined.");
  // }

  const trustAssetCallback = async () => {
    const assetString = `${assetCode}:${assetIssuer}`;

    await trustAsset({
      publicKey,
      connectedWallet,
      networkPassphrase: networkConfig.network,
      networkUrl: networkConfig.url,
      untrustedAsset: {
        assetString,
        assetCode,
        assetIssuer,
      },
      setIsSigningWithLedger,
    });

    return assetString;
  };

  try {
    // Check toml
    const tomlResponse = await checkTomlForFields({
      sepName: "SEP-24 deposit",
      assetIssuer,
      requiredKeys: [
        TomlFields.SIGNING_KEY,
        TomlFields.TRANSFER_SERVER_SEP0024,
        TomlFields.WEB_AUTH_ENDPOINT,
      ],
      networkUrl: networkConfig.url,
      homeDomain,
    });

    // Check info
    await checkInfo({
      type: "deposit",
      toml: tomlResponse,
      assetCode,
    });
    // alert("SEP-24 deposit is enabled, and requires authentication so we should go through SEP-10");

    //checking and adding trust line
    let balances = [];
    try {
      balances = await stellar.getBalances(pubKey);
      if (!stellar.hasTrust(balances, assetCode, assetIssuer)) {
        await trustAssetCallback();
      }
    } catch (error) {
      if (error instanceof StellarSdk.NotFoundError) {
        //Account Not found
        if (
          !get(
            find(AssetsList, { code: assetCode }),
            "allow_deposit_without_trust"
          )
        ) {
          throw "messages.account_not_found";
        }
      } else {
        throw error;
      }
    }

    //Checking if the token is previously fetched and still valid
    const savedToken = getTransactionToken({
      publicKey,
      authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
    });

    if (savedToken && !isJwtExpired(savedToken)) {
      token = savedToken;
    } else {
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
        pubKey,
        setIsSigningWithLedger
      );

      // SEP-10 send
      token = await sep10AuthSend({
        authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
        signedChallengeTransaction,
      });
    }

    //storing token for future calls
    addTransactionToken({
      token,
      publicKey,
      authEndpoint: tomlResponse.WEB_AUTH_ENDPOINT,
    });

    // Interactive flow
    const interactiveResponse = await interactiveDepositFlow({
      assetCode,
      publicKey,
      sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
      token,
      claimableBalanceSupported,
    });
    onHideModal();
    // Create popup
    const popup = CreatePopup(interactiveResponse.url);

    // Poll transaction until complete
    const { currentStatus, trustedAssetAdded } = await pollDepositUntilComplete(
      {
        popup,
        transactionId: interactiveResponse.id,
        token,
        sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
        trustAssetCallback,
      }
    );
    return {
      currentStatus,
      trustedAssetAdded,
    };
  } catch (error) {
    // const errorMessage = getErrorMessage(error);
    setIsLoading(false);
    onHideModal();
    setToasterText(toString(error));
    // alert(error);
  }
};

export default Sep24DepositAsset;
