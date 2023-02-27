import { makeQueryString } from "../utils";

export async function getReceiveEstimatedValueAPI(params) {
  const resp = await fetch(
    `${
      process.env.NEXT_PUBLIC_HORIZON_ENDPOINT
    }/paths/strict-receive${makeQueryString(params)}`,
    {
      method: "GET",
    }
  );
  const data = await resp.json();
  return data._embedded.records[0];
}

export async function getSendEstimatedValueAPI(params) {
  const resp = await fetch(
    `${
      process.env.NEXT_PUBLIC_HORIZON_ENDPOINT
    }/paths/strict-send${makeQueryString(params)}`,
    {
      method: "GET",
    }
  );

  const data = await resp.json();
  return data._embedded.records[0];
}
