import { includes } from "lodash";
import * as albedo from "../../walletIntegration/albedo.ts";
import * as freighter from "../../walletIntegration/freighter.ts";
import * as ledger from "../../walletIntegration/ledger.ts";
import * as rabet from "../../walletIntegration/rabet.ts";
import { isChrome } from "../../utils";
import * as xbull from "../../walletIntegration/xbull.ts";

const ConnectWallet = async ({ wallet, setToasterText }) => {
  try {
    let pubKey = "";
    switch (wallet) {
      case "albedo":
        pubKey = await albedo.getPublicKey();
        break;
      case "freighter":
        pubKey = await freighter.getPublicKey();
        break;
      case "rabet":
        pubKey = await rabet.getPublicKey();
        break;
      case "xbull":
        pubKey = await xbull.getPublicKey();
      case "ledger":
        if (isChrome()) {
          try {
            pubKey = await ledger.getPublicKey();
          } catch (error) {
            console.log(error);
            throw ledger.clarifyErrorMessage(error);
          }
        } else {
          throw "messages.browser_not_supported";
        }
        break;
      default:
        break;
    }
    return pubKey;
  } catch (err) {
    if (includes(err, "messages.")) {
      setToasterText(err);
      return;
    }
    if (err.code != "-4") {
      setToasterText("Something went wrong while connecting to " + wallet);
    }
    if (err.error) {
      if (err.error === "no-account")
        setToasterText("Please login the extension first");
    }
  }
};

export default ConnectWallet;
