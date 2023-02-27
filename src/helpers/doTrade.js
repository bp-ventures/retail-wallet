const StellarSdk = require("stellar-sdk");
import * as stellar from "../stellar.ts";
import { SignTrx } from "../stellar/";
import { toString } from "lodash";

const doTrade = async ({
  wallet,
  walletPubkey,
  network,
  fromAsset,
  fromIssuer,
  toAsset,
  toIssuer,
  fromAmount,
  toMinAmount,
  destPubkey,
  setIsSigningWithLedger,
}) => {
  const server = stellar.server();
  console.log("loading account");
  const account = await server.loadAccount(walletPubkey);

  console.log("checking balance");
  const balances = await stellar.getBalances(walletPubkey, account);
  if (!stellar.hasSufficientBalance(balances, fromAsset, fromIssuer, fromAmount)) {
    throw `Insufficient balance for asset ${fromAsset}`;
  }
  console.log("checking trust");
  const hasTrust = stellar.hasTrust(balances, toAsset, toIssuer);
  if (!hasTrust) {
    console.log("adding trust");
    let trustBuilder = new StellarSdk.TransactionBuilder(account, {
      fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
      networkPassphrase: stellar.toNetworkPassphrase(network),
    });
    trustBuilder = trustBuilder.addOperation(
      StellarSdk.Operation.changeTrust({
        asset: stellar.toAsset(toAsset, toIssuer),
      })
    );
    let trustEnvelope = trustBuilder.setTimeout(60).build();
    const trustSignedTx = await SignTrx(wallet, trustEnvelope, network, walletPubkey, setIsSigningWithLedger);
    try {
      await server.submitTransaction(trustSignedTx);
    } catch (error) {
      console.log(error.response);
      throw stellar.getMeaningfulErrorMessage(error, "Failed to submit Stellar transaction");
    }
  }

  const fromStellarAsset = stellar.toAsset(fromAsset, fromIssuer);
  const toStellarAsset = stellar.toAsset(toAsset, toIssuer);

  console.log("fetching send paths");
  let callBuilder = server.strictSendPaths(fromStellarAsset, fromAmount, [toStellarAsset]);
  let resp = await callBuilder.call();
  const sendPaths = resp.records;
  console.log(`got ${sendPaths.length} paths`);

  if (!sendPaths) {
    throw "Failed to find a path payment for the trade";
  }

  console.log(`sendPaths unsorted:`);
  console.log(sendPaths);
  // sort descending by destination amount to get best rate
  sendPaths.sort((a, b) => parseFloat(b.destination_amount) - parseFloat(a.destination_amount));
  console.log(`sendPaths sorted:`);
  console.log(sendPaths);
  let path;
  if (sendPaths[0].path.length > 1) {
    path = sendPaths[0].path.map((path) => {
      return stellar.toAsset(path.asset_code, path.asset_issuer);
    });
  } else {
    path = [];
  }

  console.log(`best path is ${path}`);

  console.log("creating envelope");

  const txEnvelope = new StellarSdk.TransactionBuilder(account, {
    fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
    networkPassphrase: stellar.toNetworkPassphrase(network),
  })
    .addOperation(
      StellarSdk.Operation.pathPaymentStrictSend({
        sendAsset: fromStellarAsset,
        sendAmount: toString(fromAmount),
        destination: destPubkey,
        destAsset: toStellarAsset,
        destMin: toMinAmount,
        path,
      })
    )
    .setTimeout(60)
    .build();

  const signedTx = await SignTrx(wallet, txEnvelope, network, walletPubkey, setIsSigningWithLedger);

  console.log("submitting transaction");
  try {
    resp = await server.submitTransaction(signedTx);
  } catch (error) {
    console.log(error.response);
    throw stellar.getMeaningfulErrorMessage(error, "Failed to submit Stellar transaction");
  }
  console.log(resp);
  return resp;
};

export default doTrade;
