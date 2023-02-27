import { each } from "lodash";

export const interactiveWithdrawFlow = async ({ assetCode, publicKey, sep24TransferServerUrl, token }) => {
  const formData = new FormData();
  const postWithdrawParams = {
    asset_code: assetCode,
    account: publicKey,
    lang: "en",
  };

  each(postWithdrawParams, (value, key) => formData.append(key, value));

  const response = await fetch(`${sep24TransferServerUrl}/transactions/withdraw/interactive`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 403 || response.status === 401) {
    return response;
  }
  const interactiveJson = await response.json();

  if (!interactiveJson.url) {
    throw new Error("No URL returned from POST `/transactions/withdraw/interactive`");
  }

  return interactiveJson;
};
