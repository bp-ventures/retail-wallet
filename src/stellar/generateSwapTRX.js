import StellarSDK from "stellar-sdk";
import getAssetDetails from "../helpers/getAssetDetails";
import BN from "../helpers/BN";
import transactionConsts from "./consts";
import { toLower } from "lodash";
import { getNetworkConfig } from "../helpers";

const server = new StellarSDK.Server(process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);

export default async function generateSwapTRX(
  { checkout, needToTrust },
  forceTrust = false
) {
  const calculatedMin = new BN(checkout.estimatedPrice).times(
    new BN(1).minus(new BN(checkout.priceSpread).div(100))
  );

  const account = await server.loadAccount(checkout.fromAddress);
  const fee = await server.fetchBaseFee();
  const networkConfigs = getNetworkConfig();

  let transaction = new StellarSDK.TransactionBuilder(account, {
    fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
    networkPassphrase: networkConfigs.network,
  });

  if ((needToTrust || forceTrust) && !checkout.to.asset.details.isNative()) {
    transaction = transaction.addOperation(
      StellarSDK.Operation.changeTrust({
        asset: checkout.to.asset.details,
      })
    );
  }

  const path = checkout.paths.map((i) =>
    getAssetDetails({ issuer: i.asset_issuer, code: i.asset_code })
  );

  transaction = transaction
    .addOperation(
      StellarSDK.Operation.pathPaymentStrictSend({
        sendAsset: checkout.from.asset.details,
        sendAmount: new BN(checkout.from.amount).toFixed(7),
        destination: checkout.toAddress,
        destAsset: checkout.to.asset.details,
        destMin: calculatedMin.toFixed(7),
        path: path,
      })
    )
    .setTimeout(transactionConsts.TIMEOUT)
    .build();

  return transaction;
}
