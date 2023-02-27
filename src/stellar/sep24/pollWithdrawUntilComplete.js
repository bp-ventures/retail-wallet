import StellarSdk, {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Operation,
  TransactionBuilder,
} from "stellar-sdk";
import { TransactionStatus } from "../../consts";
import { createMemoFromType } from "../sep24/createMemoFromType";
import { SignTrx } from "../index";
import { toLower } from "lodash";
import * as ga from "../../lib/helpers/ga";

export const pollWithdrawUntilComplete = async ({
  secretKey,
  popup,
  publicKey,
  transactionId,
  token,
  sep24TransferServerUrl,
  networkPassphrase,
  networkUrl,
  assetCode,
  assetIssuer,
  connectedWallet,
  setIsSigningWithLedger,
}) => {
  const server = new StellarSdk.Server(networkUrl);
  let currentStatus = TransactionStatus.INCOMPLETE;

  const transactionUrl = new URL(
    `${sep24TransferServerUrl}/transaction?id=${transactionId}`
  );

  const endStatuses = [TransactionStatus.COMPLETED, TransactionStatus.ERROR];

  while (!popup.closed && !endStatuses.includes(currentStatus)) {
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(transactionUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    // eslint-disable-next-line no-await-in-loop
    const transactionJson = await response.json();

    if (transactionJson.transaction.status !== currentStatus) {
      currentStatus = transactionJson.transaction.status;
      // eslint-disable-next-line no-param-reassign
      popup.location.href = transactionJson.transaction.more_info_url;

      switch (currentStatus) {
        case TransactionStatus.PENDING_USER_TRANSFER_START: {
          const memo = createMemoFromType(
            transactionJson.transaction.withdraw_memo,
            transactionJson.transaction.withdraw_memo_type
          );

          // eslint-disable-next-line no-await-in-loop

          const account = await server.loadAccount(publicKey);
          const txn = new TransactionBuilder(account, {
            fee: process.env.NEXT_PUBLIC_STELLAR_BASE_FEE,
            networkPassphrase,
          })
            .addOperation(
              Operation.payment({
                destination:
                  transactionJson.transaction.withdraw_anchor_account,
                asset: new Asset(assetCode, assetIssuer),
                amount: transactionJson.transaction.amount_in,
              })
            )
            .addMemo(memo)
            .setTimeout(0)
            .build();

          const signedTransaction = await SignTrx(
            connectedWallet,
            txn,
            toLower(process.env.NEXT_PUBLIC_STELLAR_NETWORK),
            publicKey,
            setIsSigningWithLedger
          );

          // eslint-disable-next-line no-await-in-loop
          const horizonResponse = await server.submitTransaction(
            signedTransaction
          );
          ga.event({
            action: "withdraw",
            params: {
              event_label: "withdraw",
            },
          });
          break;
        }
        case TransactionStatus.PENDING_ANCHOR: {
          break;
        }
        case TransactionStatus.PENDING_STELLAR: {
          break;
        }
        case TransactionStatus.PENDING_EXTERNAL: {
          break;
        }
        case TransactionStatus.PENDING_USER: {
          break;
        }
        case TransactionStatus.ERROR: {
          break;
        }
        default:
        // do nothing
      }
    }
    // run loop every 2 seconds
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (!endStatuses.includes(currentStatus) && popup.closed) {
    throw "messages.popup_closed_before_terminal_status";
  }

  return currentStatus;
};
