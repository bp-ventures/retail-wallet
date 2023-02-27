const StellarSdk = require("stellar-sdk");
import albedo from "@albedo-link/intent";

export const isAlbedoInstalled = async () => await albedo.publicKey({});

export const getPublicKey = async () => {
  const res = await albedo.publicKey({});
  return res.pubkey;
};

export const signTx = async (envelope, network) => {
  // dynamic import to prevent issues with SSR
  const { default: albedo } = await import("@albedo-link/intent");

  const signedXDR = await albedo.tx({
    xdr: envelope.toXDR(),
    network: network,
  });

  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXDR.signed_envelope_xdr,
    process.env.NEXT_PUBLIC_HORIZON_ENDPOINT
  );
  return transaction;
};
