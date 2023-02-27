import { TransactionStatus } from "../../consts";
import * as ga from "../../lib/helpers/ga";

export const pollDepositUntilComplete = async ({
  popup,
  transactionId,
  token,
  sep24TransferServerUrl,
  trustAssetCallback,
}) => {
  let currentStatus = TransactionStatus.INCOMPLETE;
  let trustedAssetAdded;

  const transactionUrl = new URL(
    `${sep24TransferServerUrl}/transaction?id=${transactionId}`
  );

  const endStatuses = [
    TransactionStatus.PENDING_EXTERNAL,
    TransactionStatus.COMPLETED,
    TransactionStatus.ERROR,
  ];

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
        case TransactionStatus.PENDING_TRUST: {
          try {
            // eslint-disable-next-line no-await-in-loop
            trustedAssetAdded = await trustAssetCallback();
          } catch (error) {
            throw new Error(error);
          }
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

  if (
    [TransactionStatus.PENDING_USER_TRANSFER_START].includes(currentStatus) &&
    popup.closed
  ) {
    ga.event({
      action: "deposit",
      params: {
        event_label: "deposit",
      },
    });
    throw "messages.popup_closed_pending_user_transfer_start";
  }

  if (!endStatuses.includes(currentStatus) && popup.closed) {
    throw "messages.popup_closed_before_terminal_status";
  }

  return { currentStatus, trustedAssetAdded };
};
