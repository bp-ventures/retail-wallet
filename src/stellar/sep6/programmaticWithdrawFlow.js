import { each } from "lodash";

export const programmaticWithdrawFlow = async ({
  assetCode,
  publicKey,
  transferServerUrl,
  token,
  // type,
  withdrawFields,
  // claimableBalanceSupported,
}) => {
  const API_METHOD = "GET";
  const REQUEST_URL_STR = `${transferServerUrl}/withdraw`;
  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const getWithdrawParams = {
    asset_code: assetCode,
    account: publicKey,
    // claimable_balance_supported: claimableBalanceSupported.toString(),
    // type,
    ...withdrawFields,
  };

  each(getWithdrawParams, (value, key) =>
    REQUEST_URL.searchParams.append(key, value)
  );

  const response = await fetch(`${REQUEST_URL}`, {
    method: API_METHOD,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  const withdrawJson = await response.json();

  if (response.status !== 200) {
    throw new Error(withdrawJson.error);
  }

  return withdrawJson;
};
