import { each } from "lodash";

export const programmaticDepositFlow = async ({
  // amount = "",
  assetCode,
  publicKey,
  transferServerUrl,
  // token,
  // type,
  depositFields,
  // claimableBalanceSupported,
}) => {
  const API_METHOD = "GET";
  const REQUEST_URL_STR = `${transferServerUrl}/deposit`;
  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const getDepositParams = {
    asset_code: assetCode,
    account: publicKey,
    // claimable_balance_supported: claimableBalanceSupported.toString(),
    // type,
    // amount,
    ...depositFields,
  };

  each(getDepositParams, (value, key) =>
    REQUEST_URL.searchParams.append(key, value)
  );

  const response = await fetch(`${REQUEST_URL}`, {
    method: API_METHOD,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  const depositJson = await response.json();

  return depositJson;
};
