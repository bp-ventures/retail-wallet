import { get } from "lodash";
var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server(process.env.NEXT_PUBLIC_HORIZON_ENDPOINT);
const GetBalances = async (pubKey) => {
  try {
    const account = await server.loadAccount(pubKey);
    return get(account, "balances", []);
  } catch (error) {
    throw "messages.account_not_found";
  }
};

export default GetBalances;
