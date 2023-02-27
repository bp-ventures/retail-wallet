import * as freighterApi from "@stellar/freighter-api";
import StellarSDK from "stellar-sdk";
import { toUpper } from "lodash";

export const isConnected = () => freighterApi.isConnected();

export const getPublicKey = () => {
  if (isConnected()) {
    return freighterApi.getPublicKey();
  }
};

export const signTx = async (txEnvelope, network) => {
  const signedXDR = await freighterApi.signTransaction(txEnvelope.toXDR(), toUpper(network));
  const transaction = StellarSDK.TransactionBuilder.fromXDR(signedXDR, process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);
  return transaction;
};
