import Str from "@ledgerhq/hw-app-str";
import Transport from "@ledgerhq/hw-transport-webusb";
import StellarSDK from "stellar-sdk";

export async function getPublicKey() {
  const transport = await Transport.create();
  const str = new Str(transport);
  const result = await str.getPublicKey("44'/148'/0'");
  return result.publicKey;
}

export const clarifyErrorMessage = (message?: string) => {
  if (!message) {
    return null;
  }
  if (message.includes("0x6511")) {
    return "messages.please_select_stellar_app";
  }

  if (message.includes("0x6700")) {
    return "messages.firmware_does_not_support_webusb";
  }

  return "messages.failed_to_connect_ledger";
};

export async function signTx(trx, pubKey) {
  try {
    console.log(trx); // dbg
    const transport = await Transport.create();
    const str = new Str(transport);
    const signatureFromLedger = await str.signTransaction("44'/148'/0'", trx.signatureBase());
    console.log(signatureFromLedger); // dbg

    // const publickey = trx.source;
    // console.log(publickey);

    const keyPair = StellarSDK.Keypair.fromPublicKey(pubKey);
    console.log(keyPair); // dbg
    const hint = keyPair.signatureHint();
    console.log(hint); // dbg
    const decorated = new StellarSDK.xdr.DecoratedSignature({
      hint,
      signature: signatureFromLedger.signature,
    });
    trx.signatures.push(decorated);

    console.log(trx); // dbg
    return trx;
  } catch (error) {
    console.log(error); // dbg
    throw new Error(error);
  }
}
