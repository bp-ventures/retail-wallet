export const send = async ({ authEndpoint, signedChallengeTransaction }) => {
  const params = {
    transaction: signedChallengeTransaction.toEnvelope().toXDR("base64"),
  };

  const urlParams = new URLSearchParams(params);
  const result = await fetch(authEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlParams.toString(),
  });

  const resultJson = await result.json();

  if (!resultJson.token) {
    throw new Error("No token returned from `/auth`");
  }

  return resultJson.token;
};
