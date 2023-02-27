import { each } from "lodash";

export const interactiveDepositFlow = async ({
  assetCode,
  publicKey,
  sep24TransferServerUrl,
  token,
  claimableBalanceSupported,
}) => {
  const formData = new FormData();
  const postDepositParams = {
    asset_code: assetCode,
    account: publicKey,
    lang: "en",
    claimable_balance_supported: claimableBalanceSupported.toString(),
  };

  each(postDepositParams, (value, key) => formData.append(key, value));

  const response = await fetch(
    `${sep24TransferServerUrl}/transactions/deposit/interactive`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const interactiveJson = await response.json();

  if (!interactiveJson.url) {
    throw new Error(
      "No URL returned from POST `/transactions/deposit/interactive`"
    );
  }

  return interactiveJson;
};
