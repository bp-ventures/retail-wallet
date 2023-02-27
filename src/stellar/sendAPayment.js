import { toLower } from "lodash";
import { T } from "../components/translation";
import { getAssetDetails, getNetworkConfig } from "../helpers";
import { SignTrx } from "./index";

var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server(process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);

// Transaction will hold a built transaction we can resubmit if the result is unknown.
var transaction;
const SendAPayment = ({
  onHide,
  setIsSubmitting,
  asset,
  destinationId,
  amount,
  pubKey,
  connectedWallet,
  memo,
  setToasterText,
  setIsSigningWithLedger,
  setIsSuccess,
}) => {
  // First, check to make sure that the destination account exists.
  // You could skip this, but if the account does not exist, you will be charged
  // the transaction fee when the transaction fails.
  setIsSubmitting(true);
  return (
    server
      .loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(function (error) {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new Error("The destination account does not exist!");
        } else return error;
      })
      // If there was no error, load up-to-date information on your account.
      .then(function () {
        // return server.loadAccount(sourceKeys.publicKey());
        return server.loadAccount(pubKey);
      })
      .then(async function (sourceAccount) {
        // Start building the transaction.

        const networkConfigs = getNetworkConfig();
        const assetObj = getAssetDetails(asset);
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
          networkPassphrase: networkConfigs.network,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationId,
              // Because Stellar allows transaction in many currencies, you must
              // specify the asset type. The special "native" asset represents Lumens.
              asset: assetObj,
              amount,
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text(memo))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(180)
          .build();

        const signedTransaction = await SignTrx(
          connectedWallet,
          transaction,
          toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
          pubKey,
          setIsSigningWithLedger
        );

        // And finally, send it off to Stellar!
        return server.submitTransaction(signedTransaction);
      })
      .then(function (result) {
        setIsSubmitting(false);
        onHide();
        setIsSuccess(true);
        setToasterText && setToasterText(() => T("messages.payment_success"));
        console.log("Success! Results:", result);
      })
      .catch(function (error) {
        setIsSubmitting(false);
        setToasterText &&
          setToasterText(() => T("messages.something_went_wrong"));
        console.error("Something went wrong!", error);
        throw error;
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      })
  );
};
export default SendAPayment;
