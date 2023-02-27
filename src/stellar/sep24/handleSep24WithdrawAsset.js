import { isJwtExpired } from "jwt-check-expiration";
import { toLower, toString, get, find } from "lodash";
import { SignTrx } from "../";
import { getNetworkConfig } from "../../helpers";
import {
  getTransactionToken,
  addTransactionToken,
} from "../../lib/helpers/localStorageApp";
import { TomlFields } from "../../types/types.d";
import { sep10AuthSend, sep10AuthStart } from "../sep10Auth";
import { checkInfo } from "./checkInfo";
// import { getErrorMessage } from "../../helpers";
import { checkTomlForFields } from "./checkTomlForFields";
import { CreatePopup } from "../../components/createPopup";
import { getHomeDomainFromAssetIssuer } from "./getHomeDomainFromAssetIssuer";
import { interactiveWithdrawFlow } from "./interactiveWithdrawFlow";
import { pollWithdrawUntilComplete } from "./pollWithdrawUntilComplete";
const Sep24WithdrawAsset = async ({
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
  // const { data, secretKey } = accountSelector(getState());
  // const { pubnet, claimableBalanceSupported } = settingsSelector(getState());
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

  try {
    // Check toml

    const tomlResponse = await checkTomlForFields({
      sepName: "SEP-24 withdraw",
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
      type: "withdraw",
      toml: tomlResponse,
      assetCode,
    });
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
    const interactiveResponse = await interactiveWithdrawFlow({
      assetCode,
      publicKey,
      sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
      token,
    });
    onHideModal();
    // Create popup
    const popup = CreatePopup(interactiveResponse.url);

    // Poll transaction until complete
    const { currentStatus } = await pollWithdrawUntilComplete({
      popup,
      publicKey,
      transactionId: interactiveResponse.id,
      token,
      sep24TransferServerUrl: tomlResponse.TRANSFER_SERVER_SEP0024,
      networkPassphrase: networkConfig.network,
      networkUrl: networkConfig.url,
      assetCode,
      assetIssuer,
      connectedWallet,
      setIsSigningWithLedger,
    });
    return {
      currentStatus,
    };
  } catch (error) {
    // const errorMessage = getErrorMessage(error);
    setIsLoading(false);
    onHideModal();
    setToasterText(toString(error));
    // alert(error);
  }
};

export default Sep24WithdrawAsset;
