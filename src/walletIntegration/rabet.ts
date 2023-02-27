import * as stellar from "../stellar";
import StellarSDK from "stellar-sdk";
declare global {
  interface Window {
    rabet: any;
  }
}

export async function getPublicKey() {
  const { publicKey } = await window.rabet.connect();
  return publicKey;
}

export const signTx = async (txEnvelope, network) => {
  const { xdr } = await window.rabet.sign(txEnvelope.toXDR(), stellar.toNetworkPassphrase(network));
  const transaction = StellarSDK.TransactionBuilder.fromXDR(xdr, process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);
  return transaction;
};
