import StellarSDK from "stellar-sdk";
import * as stellar from "../stellar";

declare global {
  interface Window {
    xBullSDK: any;
  }
}

export async function getPublicKey() {
  return await window.xBullSDK.getPublicKey();
}

export const signTx = async (txEnvelope, network) => {
  const xdr = await window.xBullSDK.signXDR(txEnvelope.toXDR(), { network: stellar.toNetworkPassphrase(network) });
  const transaction = StellarSDK.TransactionBuilder.fromXDR(xdr, process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);
  return transaction;
};
