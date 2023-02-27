import { first, get, toString } from "lodash";
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server(process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);
const GetStrictSendPaths = async (
  sourceAsset,
  sourceAmount,
  destinationAsset
) => {
  const result = await server
    .strictSendPaths(sourceAsset, toString(sourceAmount), [destinationAsset])
    .call()
    .catch(function (err) {
      console.error(err);
    });

  return get(first(get(result, "records")), "destination_amount", "0");
};

export default GetStrictSendPaths;
