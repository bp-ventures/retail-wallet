import * as albedo from "../walletIntegration/albedo.ts";
import * as freighter from "../walletIntegration/freighter.ts";
import * as rabet from "../walletIntegration/rabet.ts";
import * as ledger from "../walletIntegration/ledger";
import * as xbull from "../walletIntegration/xbull.ts";

const SignTrx = async (
  connectedWallet,
  txEnvelope,
  network,
  pubKey,
  setIsSigningWithLedger
) => {
  switch (connectedWallet) {
    case "albedo":
      console.log("signing using albedo");
      try {
        return await albedo.signTx(txEnvelope, network);
      } catch (error) {
        console.error(error);
        console.log(error.stack);
        throw "messages.failed_to_sign_transaction_with_albedo";
      }
    case "freighter":
      console.log("signing using freighter");
      try {
        return await freighter.signTx(txEnvelope, network);
      } catch (error) {
        console.error(error);
        console.log(error.stack);
        throw "messages.failed_to_sign_transaction_with_freighter";
      }
    case "rabet":
      console.log("signing using rabet");
      try {
        return await rabet.signTx(txEnvelope, network);
      } catch (error) {
        console.error(error);
        console.log(error.stack);
        throw "messages.failed_to_sign_transaction_with_rabet";
      }
    case "xbull":
      console.log("signing using xBull");
      try {
        return await xbull.signTx(txEnvelope, network);
      } catch (error) {
        console.error(error);
        console.log(error.stack);
        throw "messages.failed_to_sign_transaction_with_xbull";
      }
    case "ledger":
      console.log("signing using ledger");
      try {
        setIsSigningWithLedger(true);
        const result = await ledger.signTx(txEnvelope, pubKey);
        setIsSigningWithLedger(false);
        return result;
      } catch (error) {
        setIsSigningWithLedger(false);
        console.error(error);
        console.log(error.stack);
        throw "messages.failed_to_sign_transaction_with_ledger";
      }
    default:
      break;
  }
};
export default SignTrx;
