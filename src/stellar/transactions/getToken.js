const getToken = async ({ authEndpoint }) => {
  const result = await fetch(authEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const resultJson = await result.json();

  if (!resultJson.token) {
    throw new Error("No token returned from `/auth`");
  }

  return resultJson.token;
};

export default getToken;
