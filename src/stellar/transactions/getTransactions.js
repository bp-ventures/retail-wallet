import { get } from "lodash";

export const getTransactions = async ({ type, toml, assetCode, token }) => {
  const infoURL = `${toml.TRANSFER_SERVER_SEP0024}/transactions?asset_code=${assetCode}`;
  const info = await fetch(infoURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const transactionsJson = await info.json();

  if (!get(transactionsJson, "transactions")) {
    throw new Error("transactions not found");
  }
  return get(transactionsJson, "transactions");
};
