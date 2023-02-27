import { toLower } from "lodash";
import StellarSdk, {
  Asset,
  BASE_FEE,
  Operation,
  TransactionBuilder,
} from "stellar-sdk";
import { SignTrx } from "../";
import * as stellar from "./../../stellar";

export const trustAsset = async ({
  publicKey,
  connectedWallet,
  untrustedAsset,
  networkUrl,
  networkPassphrase,
  setIsSigningWithLedger,
}) => {
  try {
    const server = new StellarSdk.Server(networkUrl);

    const account = await server.loadAccount(publicKey);

    const transaction = new TransactionBuilder(account, {
      fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        Operation.changeTrust({
          asset: new Asset(
            untrustedAsset.assetCode,
            untrustedAsset.assetIssuer
          ),
        })
      )
      .setTimeout(0)
      .build();

    const signedTransaction = await SignTrx(
      connectedWallet,
      transaction,
      toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
      publicKey,
      setIsSigningWithLedger
    );
    const result = await server.submitTransaction(signedTransaction);

    return result;
  } catch (error) {
    throw stellar.getMeaningfulErrorMessage(error, new Error(error));
  }
};
